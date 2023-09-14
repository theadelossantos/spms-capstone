from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from .models import *
from .serializers import UserSerializer, StudentSerializer, SubjectSerializer, TeacherSerializer, AdminSerializer, CustomTokenObtainPairSerializer, SectionSerializer, AdminLoginSerializer, AdminTokenObtainPairSerializer, GradeLevelSerializer
from django.contrib.auth import authenticate
from rest_framework import status, generics, permissions, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import HttpResponse
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
import json
import base64
from django.http import JsonResponse
from .models import Department
from django.views import View
from django.db import transaction
from rest_framework.decorators import api_view

class AddStudentView(APIView):
    def post(self, request):
        user_serializer = UserSerializer(data=request.data.get('user'))
        student_serializer = StudentSerializer(data=request.data)

        if user_serializer.is_valid() and student_serializer.is_valid():
            user = user_serializer.save()
            student_data = {**student_serializer.validated_data, 'user': user}
            student = Student.objects.create(**student_data)

            user.role = 'student'
            user.save()

            return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        else:
            student_serializer.is_valid()

            return Response({
                "user_errors": user_serializer.errors,
                "student_errors": student_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

# ADD TEACHERS ELEM 
class AddTeacherView(APIView):
    def post(self, request):
        request.data['dept_id'] = 1
        user_serializer = UserSerializer(data=request.data.get('user'))
        teacher_serializer = TeacherSerializer(data=request.data)

        if user_serializer.is_valid() and teacher_serializer.is_valid():
            user = user_serializer.save()
            teacher_data = {**teacher_serializer.validated_data, 'user': user}
            teacher = Teacher.objects.create(**teacher_data)

            user.role = 'teacher'
            user.save()

            return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        else:
            teacher_serializer.is_valid()

            return Response({
                "user_errors": user_serializer.errors,
                "teacher_errors": teacher_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
def filter_teachers(request, grade_level_id):
    try:
        grade_level = GradeLevel.objects.get(pk = grade_level_id)
        teachers = Teacher.objects.filter(gradelvl_id = grade_level_id, dept_id = 1)
        teachers_data = [{'id':teacher.teacher_id,
                          'dept_id':teacher.dept_id.dept_id,
                          'gradelvl_id':teacher.gradelvl_id.gradelvl_id,
                          'section_id':teacher.section_id.section_id,
                          'subject_id':teacher.subject_id.subject_id,
                          'fname':teacher.fname,
                          'mname':teacher.mname,
                          'lname':teacher.lname,
                          'address':teacher.address,
                          'phone':teacher.phone,
                          'gender':teacher.gender,
                          'birthdate':teacher.birthdate
                          } for teacher in teachers]
        grade_level_data = {'id':grade_level.gradelvl_id, 'name':grade_level.gradelvl}

        return JsonResponse({'grade_level': grade_level_data, 'teachers': teachers_data})
    except GradeLevel.DoesNotExist:
        return JsonResponse({'error':'Grade Level not Found'}, status=status.HTTP_404_NOT_FOUND)


def get_grade_levels_by_department(request, department_id):
    try:
        department = Department.objects.get(pk=department_id)
        grade_levels = GradeLevel.objects.filter(dept_id=department)
        data = [{
             'gradelvl_id': gradelvl.gradelvl_id,
            'dept_id': gradelvl.dept_id.dept_id,
            'name': gradelvl.gradelvl
        } for gradelvl in grade_levels]
        return JsonResponse({'gradelevels': data})
    except Department.DoesNotExist:
        return JsonResponse({'error': 'Department not found'}, status=404)
    
def get_sections_by_department(request, department_id, grade_level_id):
    try:
        department = Department.objects.get(pk=department_id)
        gradelevel = GradeLevel.objects.get(pk=grade_level_id)
        sections = Section.objects.filter(dept_id=department, grade_level_id=gradelevel)
        data = [{
            'section_id':section.section_id,
            'gradelvl_id': section.gradelvl_id,
            'dept_id': section.dept_id.dept_id,
            'name': section.gradelvl
        } for section in sections]
        return JsonResponse({'gradelevels': data})
    except Department.DoesNotExist:
        return JsonResponse({'error': 'Department not found'}, status=404)
    
class EditTeacherView(APIView):
    def get(self, request, teacher_id):
        try:
            teacher = Teacher.objects.get(teacher_id = teacher_id)
            serializer = TeacherSerializer(teacher)
            return Response({'teacher':serializer.data})
        except Teacher.DoesNotExist:
            return Response({'error':'Teacher not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, teacher_id):
        try:
            with transaction.atomic():
                teacher = Teacher.objects.get(teacher_id = teacher_id)
                serializer = TeacherSerializer(teacher, data=request.data, partial=True)

                if serializer.is_valid():
                    serializer.save()
                    return Response({'message': 'Teacher updated Successfully'})
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Teacher.DoesNotExist:
            return Response({'error':'Teacher not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_teacher(request, teacher_id):
    try:
        teacher = Teacher.objects.get(teacher_id = teacher_id)
    except Teacher.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        teacher.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminRegistrationView(APIView):
    def post(self, request):
        user_serializer = UserSerializer(data=request.data.get('user'))
        admin_serializer = AdminSerializer(data=request.data)

        if user_serializer.is_valid() and admin_serializer.is_valid():
            user = user_serializer.save()
            user.role = 'admin'
            user.is_staff = True
            user.is_superuser = True
            user.save()

            admin_data = {**admin_serializer.validated_data, 'user': user}
            admin = Admin.objects.create(**admin_data)

            return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        else:
            user_errors = user_serializer.errors if not user_serializer.is_valid() else {}
            admin_errors = admin_serializer.errors if not admin_serializer.is_valid() else {}

            return Response({
                "user_errors": user_errors,
                "admin_errors": admin_errors
            }, status=status.HTTP_400_BAD_REQUEST)


class AdminLoginView(APIView):
    def post(self,request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(request, email=email, password = password)

            if user is not None:
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                return Response({'access_token': access_token}, status=status.HTTP_200_OK)
            else:
                return Response({'message':'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer

    def set_cookie(self, response, key, value, days_expire=7, secure=True, httponly=False, samesite='Lax'):
        if secure:
            response.set_cookie(key, value, max_age=days_expire * 24 * 60 * 60, secure=True, httponly=httponly, samesite=samesite, path='/', domain='localhost')
        else:
            response.set_cookie(key, value, max_age=days_expire * 24 * 60 * 60, httponly=httponly, samesite=samesite, path='/', domain='localhost')

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        refresh_token = response.data.get('refresh')
        access_token = response.data.get('access')

        samesite = 'Lax'
        secure = True

        self.set_cookie(response, 'refresh', refresh_token, secure=secure, samesite=samesite)
        self.set_cookie(response, 'access', access_token, secure=secure, samesite=samesite)

        return response
        
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def set_cookie(self, response, key, value, days_expire=7, secure=True, httponly=False, samesite='Lax'):
        if secure:
            response.set_cookie(key, value, max_age=days_expire * 24 * 60 * 60, secure=True, httponly=httponly, samesite=samesite, path='/', domain='localhost')
        else:
            response.set_cookie(key, value, max_age=days_expire * 24 * 60 * 60, httponly=httponly, samesite=samesite, path='/', domain='localhost')

        print(f'Cookie set: {key}={value}')

        token_payload = value.split('.')[1]
        decoded_payload = json.loads(base64.b64decode(token_payload + '===').decode('utf-8'))
        roles = decoded_payload.get('roles', [])
        print(f'User Roles: {roles}')
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        print('CustomTokenObtainPairView: Inside post method')

        refresh_token = response.data.get('refresh')
        access_token = response.data.get('access')

        samesite = 'Lax'
        secure = True

        self.set_cookie(response, 'refresh', refresh_token, secure=secure, samesite=samesite)
        self.set_cookie(response, 'access', access_token, secure=secure, samesite=samesite)

        print('CustomTokenObtainPairView: Cookies set successfully')

        return response

class RoleBasedPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        role_required = getattr(view, 'role_required', None)
        if role_required:
            user = request.user
            return user.role == role_required
        return True

class UserDataView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermissions]
    role_required = 'student'

    def get(self, request):
        print('Token Payload:', request.auth.payload)
        user = request.user
        user_data = {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }

        return Response(user_data, status=status.HTTP_200_OK)

def get_departments(request):
    departments = Department.objects.all()
    data = [{
        'id': dept.dept_id, 
        'name': dept.dept_name
    } for dept in departments]
    return JsonResponse({'departments': data})

# ELEM 

def get_gradelvl_elem(request):
    elem_dept = Department.objects.get(dept_id = 1)

    gradelevel = GradeLevel.objects.filter(dept_id = elem_dept)
    data = [{
        'gradelvl_id': grdlvl.gradelvl_id,
        'dept_id': grdlvl.dept_id.dept_id,
        'name': grdlvl.gradelvl
        } for grdlvl in gradelevel] 
    return JsonResponse({'gradelevels': data})

def filter_sections(request, grade_level_id):
    try:
        grade_level = GradeLevel.objects.get(pk = grade_level_id)

        sections = Section.objects.filter(gradelvl_id = grade_level_id, dept_id = 1)
        

        section_data = [{'id':section.section_id,
                        'section_name': section.section_name,
                        'dept_id':section.dept_id.dept_id,
                        'gradelvl_id':section.gradelvl_id.gradelvl_id}
                        for section in sections]
        grade_level_data = {'id':grade_level.gradelvl_id, 'name': grade_level.gradelvl}

        return JsonResponse({'grade_level': grade_level_data, 'sections':section_data})
    except GradeLevel.DoesNotExist:
        return JsonResponse({'error': 'Grade level not found'}, status=404)

class addElemSections(APIView):
    def post(self, request):
        request.data['dept_id'] = 1
        section_serializer = SectionSerializer(data=request.data)

        if section_serializer.is_valid():
            section_serializer.save()
            return Response(section_serializer.data, status=status.HTTP_201_CREATED)
        return Response(section_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EditSectionView(APIView):
    def get(self, request, section_id):
        try:
            section = Section.objects.get(section_id=section_id)
            serializer = SectionSerializer(section)
            return Response({'section': serializer.data})
        except Section.DoesNotExist:
            return Response({'error': 'Section not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, section_id):
        try:
            with transaction.atomic():
                section = Section.objects.get(section_id=section_id)
                serializer = SectionSerializer(section, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response({'message': 'Section updated successfully'})
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Section.DoesNotExist:
            return Response({'error': 'Section not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_section(request, section_id):
    try:
        section = Section.objects.get(section_id=section_id)
    except Section.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        section.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# HIGHSCHOOL

def get_gradelvl_hs(request):
    elem_dept = Department.objects.get(dept_id = 2)

    gradelevel = GradeLevel.objects.filter(dept_id = elem_dept)
    data = [{
        'gradelvl_id': grdlvl.gradelvl_id,
        'dept_id': grdlvl.dept_id.dept_id,
        'name': grdlvl.gradelvl
        } for grdlvl in gradelevel] 
    return JsonResponse({'gradelevels': data})

def filter_hs_sections(request, grade_level_id):
    try:
        grade_level = GradeLevel.objects.get(pk = grade_level_id)

        sections = Section.objects.filter(gradelvl_id = grade_level_id, dept_id = 2)
        

        section_data = [{'id':section.section_id,
                        'section_name': section.section_name,
                        'dept_id':section.dept_id.dept_id,
                        'gradelvl_id':section.gradelvl_id.gradelvl_id}
                        for section in sections]
        grade_level_data = {'id':grade_level.gradelvl_id, 'name': grade_level.gradelvl}

        return JsonResponse({'grade_level': grade_level_data, 'sections':section_data})
    except GradeLevel.DoesNotExist:
        return JsonResponse({'error': 'Grade level not found'}, status=404)

class addHsSections(APIView):
    def post(self, request):
        request.data['dept_id'] = 2
        section_serializer = SectionSerializer(data=request.data)

        if section_serializer.is_valid():
            section_serializer.save()
            return Response(section_serializer.data, status=status.HTTP_201_CREATED)
        return Response(section_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# SHS 

def get_gradelvl_shs(request):
    elem_dept = Department.objects.get(dept_id = 3)

    gradelevel = GradeLevel.objects.filter(dept_id = elem_dept)
    data = [{
        'gradelvl_id': grdlvl.gradelvl_id,
        'dept_id': grdlvl.dept_id.dept_id,
        'name': grdlvl.gradelvl
        } for grdlvl in gradelevel] 
    return JsonResponse({'gradelevels': data})

def filter_shs_sections(request, grade_level_id):
    try:
        grade_level = GradeLevel.objects.get(pk = grade_level_id)

        sections = Section.objects.filter(gradelvl_id = grade_level_id, dept_id = 3)
        

        section_data = [{'id':section.section_id,
                        'section_name': section.section_name,
                        'dept_id':section.dept_id.dept_id,
                        'gradelvl_id':section.gradelvl_id.gradelvl_id}
                        for section in sections]
        grade_level_data = {'id':grade_level.gradelvl_id, 'name': grade_level.gradelvl}

        return JsonResponse({'grade_level': grade_level_data, 'sections':section_data})
    except GradeLevel.DoesNotExist:
        return JsonResponse({'error': 'Grade level not found'}, status=404)

class addsHsSections(APIView):
    def post(self, request):
        request.data['dept_id'] = 3
        section_serializer = SectionSerializer(data=request.data)

        if section_serializer.is_valid():
            section_serializer.save()
            return Response(section_serializer.data, status=status.HTTP_201_CREATED)
        return Response(section_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# COURSES

class EditSubjectView(APIView):
    def get(self, request, subject_id):
        try:
            subject = Subject.objects.get(subject_id = subject_id)
            serializer = SubjectSerializer(subject)
            return Response({'subject': serializer.data})
        except Subject.DoesNotExist:
            return Response({'error': 'Subject Not Found'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, subject_id):
        try:
            with transaction.atomic():  
                subject = Subject.objects.get(subject_id = subject_id)
                serializer = SubjectSerializer(subject, data=request.data, partial=True)

                if serializer.is_valid():
                    serializer.save()
                    return Response({'message':'Subject updated successfully'})
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Subject.DoesNotExist:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def delete_subject(request, subject_id):
    try:
        subject = Subject.objects.get(subject_id = subject_id)
    except Subject.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        subject.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#  ELEM COURSES
def filter_elem_courses(request, grade_level_id):
    try:
        grade_level = GradeLevel.objects.get(pk = grade_level_id)
        subjects = Subject.objects.filter(gradelvl_id = grade_level_id, dept_id = 1)

        subject_data = [{'id':subject.subject_id,
                         'subject_name': subject.subject_name,
                         'dept_id': subject.dept_id.dept_id,
                         'gradelvl_id': subject.gradelvl_id.gradelvl_id
                        } for subject in subjects]
        
        grade_level_data = {'id':grade_level.gradelvl_id, 'name':grade_level.gradelvl}
        return JsonResponse({'grade level': grade_level_data, 'subjects':subject_data})

    except GradeLevel.DoesNotExist:
        return JsonResponse({'error': 'Grade Level not Found'}, status=404)

class addElemSubjects(APIView):
    def post(self, request):
        request.data['dept_id'] = 1
        subject_serializer = SubjectSerializer(data=request.data)

        if subject_serializer.is_valid():
            subject_serializer.save()
            return Response(subject_serializer.data, status=status.HTTP_201_CREATED)
        return Response(subject_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# HIGH SCHOOL COURSES
def filter_hs_courses(request, grade_level_id):
    try:
        grade_level = GradeLevel.objects.get(pk = grade_level_id)
        subjects = Subject.objects.filter(gradelvl_id = grade_level_id, dept_id = 2)

        subject_data = [{'id':subject.subject_id,
                         'subject_name': subject.subject_name,
                         'dept_id': subject.dept_id.dept_id,
                         'gradelvl_id': subject.gradelvl_id.gradelvl_id
                        } for subject in subjects]
        
        grade_level_data = {'id':grade_level.gradelvl_id, 'name':grade_level.gradelvl}
        return JsonResponse({'grade level': grade_level_data, 'subjects':subject_data})

    except GradeLevel.DoesNotExist:
        return JsonResponse({'error': 'Grade Level not Found'}, status=404)

class addHsSubjects(APIView):
    def post(self, request):
        request.data['dept_id'] = 2
        subject_serializer = SubjectSerializer(data=request.data)

        if subject_serializer.is_valid():
            subject_serializer.save()
            return Response(subject_serializer.data, status=status.HTTP_201_CREATED)
        return Response(subject_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# SHS COURSES
def filter_shs_courses(request, grade_level_id):
    try:
        grade_level = GradeLevel.objects.get(pk = grade_level_id)
        subjects = Subject.objects.filter(gradelvl_id = grade_level_id, dept_id = 3)

        subject_data = [{'id':subject.subject_id,
                         'subject_name': subject.subject_name,
                         'dept_id': subject.dept_id.dept_id,
                         'gradelvl_id': subject.gradelvl_id.gradelvl_id
                        } for subject in subjects]
        
        grade_level_data = {'id':grade_level.gradelvl_id, 'name':grade_level.gradelvl}
        return JsonResponse({'grade level': grade_level_data, 'subjects':subject_data})

    except GradeLevel.DoesNotExist:
        return JsonResponse({'error': 'Grade Level not Found'}, status=404)

class addsHsSubjects(APIView):
    def post(self, request):
        request.data['dept_id'] = 3
        subject_serializer = SubjectSerializer(data=request.data)

        if subject_serializer.is_valid():
            subject_serializer.save()
            return Response(subject_serializer.data, status=status.HTTP_201_CREATED)
        return Response(subject_serializer.errors, status=status.HTTP_400_BAD_REQUEST)