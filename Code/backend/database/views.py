from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from .models import *
from .serializers import *
from django.contrib.auth import authenticate
from rest_framework import status, generics, permissions, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import HttpResponse
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
import base64
from django.http import JsonResponse
from .models import Department
from django.views import View
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView


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

def filter_students(request, dept_id, grade_level_id, section_id):
    try:
        grade_level = GradeLevel.objects.get(pk = grade_level_id)
        section = Section.objects.get(pk = section_id)
        students = Student.objects.filter( dept_id = dept_id, gradelvl_id = grade_level_id, section_id = section_id)
        students_data = [{'id':student.student_id,
                          'dept_id':student.dept_id.dept_id,
                          'gradelvl_id':student.gradelvl_id.gradelvl_id,
                          'section_id':student.section_id.section_id,
                          'fname':student.fname,
                          'mname':student.mname,
                          'lname':student.lname,
                          'address':student.address,
                          'phone':student.phone,
                          'gender':student.gender,
                          'birthdate':student.birthdate
                          } for student in students]
        grade_level_data = {'id':grade_level.gradelvl_id, 'name':grade_level.gradelvl}
        section_data = {'id':section.section_id, 'name': section.section_name}
        return JsonResponse({'grade_level': grade_level_data, 'students': students_data, 'sections': section_data})
    except GradeLevel.DoesNotExist:
        return JsonResponse({'error':'Grade Level not Found'}, status=status.HTTP_404_NOT_FOUND)
    
# ADD TEACHERS ELEM 
class AddTeacherView(APIView):
   def post(self, request):
        section_id = request.data.get('section_id')
        
        if section_id and Teacher.objects.filter(section_id=section_id).exists():
            return Response({"error": "Section already assigned to another teacher."}, status=status.HTTP_400_BAD_REQUEST)
        
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

class EditStudentView(APIView):
    def get(self, request, student_id):
        try:
            student = Student.objects.get(student_id=student_id)
            serializer = StudentSerializer(student)

            print({'student': serializer.data})
            return Response({'student': serializer.data})
        except Teacher.DoesNotExist:
            return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, student_id):
        try:
            with transaction.atomic():
                student = Student.objects.get(student_id=student_id)
                user_data = request.data['student']

                serializer = StudentSerializer(student, data=user_data, partial=True)

                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                return Response({'message': 'Student updated successfully'})
        except Teacher.DoesNotExist:
            return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_student(request, student_id):
    try:
        student = Student.objects.get(student_id = student_id)
    except Student.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        user = student.user
        user.delete()
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
def filter_teachers(request, grade_level_id):
    try:
        grade_level = GradeLevel.objects.get(pk = grade_level_id)
        teachers = Teacher.objects.filter(gradelvl_id = grade_level_id, dept_id = 1)
        teachers_data = [{'id':teacher.teacher_id,
                          'dept_id':teacher.dept_id.dept_id,
                          'gradelvl_id':teacher.gradelvl_id.gradelvl_id,
                          'section_id':teacher.section_id.section_id,
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

def filter_hs_teachers(request, grade_level_id):
    try:
        grade_level = GradeLevel.objects.get(pk = grade_level_id)
        teachers = Teacher.objects.filter(gradelvl_id = grade_level_id, dept_id = 2)
        teachers_data = [{'id':teacher.teacher_id,
                          'dept_id':teacher.dept_id.dept_id,
                          'gradelvl_id':teacher.gradelvl_id.gradelvl_id,
                          'section_id':teacher.section_id.section_id,
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

def filter_shs_teachers(request, grade_level_id):
    try:
        grade_level = GradeLevel.objects.get(pk = grade_level_id)
        teachers = Teacher.objects.filter(gradelvl_id = grade_level_id, dept_id = 3)
        teachers_data = [{'id':teacher.teacher_id,
                          'dept_id':teacher.dept_id.dept_id,
                          'gradelvl_id':teacher.gradelvl_id.gradelvl_id,
                          'section_id':teacher.section_id.section_id,
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
        sections = Section.objects.filter(dept_id=department, gradelvl_id=gradelevel)
        data = [{
            'section_id':section.section_id,
            'gradelvl_id': section.gradelvl_id.gradelvl_id,
            'dept_id': section.dept_id.dept_id,
            'name': section.section_name
        } for section in sections]
        return JsonResponse({'sections': data})
    except Department.DoesNotExist:
        return JsonResponse({'error': 'Department not found'}, status=404)


class EditTeacherView(APIView):
    def get(self, request, teacher_id):
        try:
            teacher = Teacher.objects.get(teacher_id=teacher_id)
            serializer = TeacherSerializer(teacher)

            print({'teacher': serializer.data})
            return Response({'teacher': serializer.data})
        except Teacher.DoesNotExist:
            return Response({'error': 'Teacher not found.'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, teacher_id):
        try:
            with transaction.atomic():
                teacher = Teacher.objects.get(teacher_id=teacher_id)
                user_data = request.data['teacher']

                section_id = user_data.get('section_id', None)

                if section_id and Teacher.objects.filter(section_id=section_id).exclude(teacher_id=teacher_id).exists():
                    return Response({"error": "Section already assigned to another teacher."}, status=status.HTTP_400_BAD_REQUEST)

                serializer = TeacherSerializer(teacher, data=user_data, partial=True)

                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                return Response({'message': 'Teacher updated successfully'})
        except Teacher.DoesNotExist:
            return Response({'error': 'Teacher not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_teacher(request, teacher_id):
    try:
        teacher = Teacher.objects.get(teacher_id = teacher_id)
    except Teacher.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        user = teacher.user
        user.delete()
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

class AdminProfileView(RetrieveUpdateAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Admin, user=self.request.user)
    
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
    
class AssignmentListCreateView(generics.ListCreateAPIView):
    queryset = Assigned.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        assignment_data = request.data.get('assignments', [])
        teacher_id = self.kwargs.get('teacher')

        assignments = []
        for data in assignment_data:
            existing_assignment = Assigned.objects.filter(
                teacher=teacher_id,
                gradelvl_id=data['gradelvl_id'],  
                section_id=data['section_id'],      
                subject_id=data['subject_id']       
            ).first()

            if existing_assignment:
                return Response({"detail": "This assignment already exists for another teacher."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            assignments.append(serializer.save())

        serializer = self.get_serializer(assignments, many=True)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def get_queryset(self):
        teacher_id = self.kwargs.get('teacher_id')
        return Assigned.objects.filter(teacher_id=teacher_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AssignmentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assigned.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.AllowAny]

@api_view(['GET'])
def get_subjects_by_dept_and_grade_level(request, dept_id, gradelvl_id):
    try:
        subjects = Subject.objects.filter(dept_id=dept_id, gradelvl_id=gradelvl_id)
        subject_data = [{'subject_id': subject.subject_id, 'subject_name': subject.subject_name} for subject in subjects]
        return Response({'subjects': subject_data}, status=status.HTTP_200_OK)
    except Subject.DoesNotExist:
        return Response({'error': 'Subjects not found.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def getDeptById(request, dept_id):
    try:
        departments = Department.objects.filter(dept_id=dept_id)
        departments_data = [{'dept_id': department.dept_id, 'dept_name': department.dept_name} for department in departments]
        return Response({'departments': departments_data}, status=status.HTTP_200_OK)
    except Subject.DoesNotExist:
        return Response({'error': 'Department not found.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def getGradelvlById(request, gradelvl_id):
    try:
        gradelevelss = GradeLevel.objects.filter(gradelvl_id=gradelvl_id)
        gradelevels_data = [{'gradelvl_id': gradelevel.gradelvl_id, 'gradelvl': gradelevel.gradelvl} for gradelevel in gradelevelss]
        return Response({'gradelevelss': gradelevels_data}, status=status.HTTP_200_OK)
    except Subject.DoesNotExist:
        return Response({'error': 'Department not found.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def getSectionById(request, section_id):
    try:
        sections = Section.objects.filter(section_id=section_id)
        sections_data = [{'section_id': section.section_id, 'section_name': section.section_name} for section in sections]
        return Response({'sections': sections_data}, status=status.HTTP_200_OK)
    except Subject.DoesNotExist:
        return Response({'error': 'Department not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def getSubjectById(request, subject_id):
    try:
        subjects = Subject.objects.filter(subject_id=subject_id)
        subjects_data = [{'subject_id': subject.subject_id, 'subject_name': subject.subject_name} for subject in subjects]
        return Response({'subjects': subjects_data}, status=status.HTTP_200_OK)
    except Subject.DoesNotExist:
        return Response({'error': 'Department not found.'}, status=status.HTTP_404_NOT_FOUND)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(View):
    def post(self, request):
        response = JsonResponse({'message': 'Logout successful'})

        response.delete_cookie('access', domain='localhost', path='/')
        response.delete_cookie('refresh', domain='localhost', path='/')

        return response

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def teacher_profile(request):
    teacher = request.user.teacher  

    serializer = TeacherSerializer(teacher)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def admin_profile(request):
    admin = request.user.admin  

    serializer = AdminSerializer(admin)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def student_profile(request):
    student = request.user.student  

    serializer = StudentSerializer(student)

    return Response(serializer.data, status=status.HTTP_200_OK)

def calculate_weighted_scores_view(request, student_id):
    try:
        student = Student.objects.get(pk=student_id)

        student_grade = StudentGrade.objects.get(student=student)

        total_hps_ww = sum(getattr(student_grade, f'hps_ww_{i}', 0) for i in range(1, 11))
        total_hps_pt = sum(getattr(student_grade, f'hps_pt_{i}', 0) for i in range(1, 11))
        total_hps_qa = getattr(student_grade, 'hps_qa_10', 0)

        ww_scores = [getattr(student_grade, f'ww_score_{i}', 0) for i in range(1, 11)]
        pt_scores = [getattr(student_grade, f'pt_score_{i}', 0) for i in range(1, 11)]
        qa_score = getattr(student_grade, 'qa_score', 0)

        ww_total_score = sum(ww_scores)
        ww_weighted_score = (ww_total_score / total_hps_ww) * 30 if total_hps_ww > 0 else 0

        pt_total_score = sum(pt_scores)
        pt_weighted_score = (pt_total_score / total_hps_pt) * 50 if total_hps_pt > 0 else 0

        qa_weighted_score = (qa_score / total_hps_qa) * 20 if total_hps_qa > 0 else 0

        # Calculate percentage score
        percentage_score = (ww_total_score / pt_total_score) * 100 if pt_total_score > 0 else 0

        # Calculate initial grade
        initial_grade = ww_weighted_score + pt_weighted_score + qa_weighted_score

        response_data = {
            'ww_weighted_score': ww_weighted_score,
            'pt_weighted_score': pt_weighted_score,
            'qa_weighted_score': qa_weighted_score,
            'percentage_score': percentage_score,  # Add percentage score to response
            'initial_grade': initial_grade,  # Add initial grade to response
        }

        return JsonResponse(response_data)
    except StudentGrade.DoesNotExist:
        return JsonResponse({'error': 'StudentGrade not found'}, status=404)

class StudentGradeListCreateView(generics.ListCreateAPIView):
    queryset = StudentGrade.objects.all()
    serializer_class = StudentGradesSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        student_id = request.data.get('student')
        subject_id = request.data.get('subject')
        gradelevel_id = request.data.get('gradelevel')
        section_id = request.data.get('section')
        quarter_id = request.data.get('quarter')

        existing_record = StudentGrade.objects.filter(
            student=student_id,
            subject=subject_id,
            gradelevel=gradelevel_id,
            section=section_id,
            quarter=quarter_id
        ).first()

        if existing_record:
            return Response({'detail': 'This record already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)

class StudentGradeUpdateView(generics.UpdateAPIView):
    queryset = StudentGrade.objects.all()
    serializer_class = StudentGradesSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        student_id = self.kwargs['student_id']
        subject_id = self.kwargs['subject_id']
        gradelevel_id = self.kwargs['gradelevel_id']
        section_id = self.kwargs['section_id']
        quarter_id = self.kwargs['quarter_id']

        obj, created = StudentGrade.objects.get_or_create(
            student_id=student_id,
            subject_id=subject_id,
            gradelevel_id=gradelevel_id,
            section_id=section_id,
            quarter_id=quarter_id
        )
        return obj

class StudentGradeBatchUpdateView(generics.UpdateAPIView):
    serializer_class = StudentGradesSerializer
    permission_classes = [permissions.AllowAny]

    def update(self, request, *args, **kwargs):
        data = request.data

        for record_data in data:
            student_id = record_data.get('student')
            subject_id = record_data.get('subject')
            gradelevel_id = record_data.get('gradelevel')
            section_id = record_data.get('section')
            quarter_id = record_data.get('quarter')

            try:
                student_grade = StudentGrade.objects.get(
                    student=student_id,
                    subject=subject_id,
                    gradelevel=gradelevel_id,
                    section=section_id,
                    quarter=quarter_id
                )

                serializer = StudentGradesSerializer(student_grade, data=record_data, partial=True)

                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            except StudentGrade.DoesNotExist:
                return Response({'detail': 'Record not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'detail': 'Batch update successful.'}, status=status.HTTP_200_OK)

class StudentGradesFilterView(APIView):
    def post(self, request):
        serializer = StudentGradesFilterSerializer(data=request.data)
        if serializer.is_valid():
            gradelevel = serializer.validated_data['gradelevel']
            section = serializer.validated_data['section']
            subject = serializer.validated_data['subject']
            quarter = serializer.validated_data['quarter']

            student_grades = StudentGrade.objects.filter(
                gradelevel=gradelevel,
                section=section,
                subject=subject,
                quarter=quarter
            )

            serializer = StudentGradesSerializer(student_grades, many=True)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class HPSFilterView(APIView):
    def post(self, request):
        serializer = HPSFilterSerializer(data=request.data)
        if serializer.is_valid():
            gradelevel = serializer.validated_data['gradelevel']
            section = serializer.validated_data['section']
            subject = serializer.validated_data['subject']
            quarter = serializer.validated_data['quarter']

            hps = HpsScores.objects.filter(
                gradelevel=gradelevel,
                section=section,
                subject=subject,
                quarter=quarter
            )

            serializer = HpsSerializer(hps, many=True)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class QuarterListCreateView(generics.ListCreateAPIView):
    queryset = Quarter.objects.all()
    serializer_class = QuarterSerializer
    permission_classes = [permissions.AllowAny]

class HPSListCreateView(generics.ListCreateAPIView):
    queryset = HpsScores.objects.all()
    serializer_class = HpsSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        subject_id = request.data.get('subject')
        gradelevel_id = request.data.get('gradelevel')
        section_id = request.data.get('section')
        quarter_id = request.data.get('quarter')

        existing_record = HpsScores.objects.filter(
            subject=subject_id,
            gradelevel=gradelevel_id,
            section=section_id,
            quarter=quarter_id
        ).first()

        if existing_record:
            return Response({'detail': 'This record already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)

class StudentGradeByQuarterListView(ListAPIView):
    serializer_class = StudentGradesSerializer

    def get_queryset(self):
        quarter_id = self.kwargs['quarter_id'] 
        queryset = StudentGrade.objects.filter(quarter=quarter_id)
        return queryset
    
class HPSByQuarterListView(ListAPIView):
    serializer_class = HpsSerializer

    def get_queryset(self):
        quarter_id = self.kwargs['quarter_id'] 
        queryset = HpsScores.objects.filter(quarter=quarter_id)
        return queryset
    
class GradesByParams(ListAPIView):
    serializer_class = StudentGradesSerializer

    def get_queryset(self):
        grade_level_id = self.kwargs['grade_level_id'] 
        section_id = self.kwargs['section_id']
        subject_id = self.kwargs['subject_id']
        quarter_id = self.kwargs['quarter_id']

        queryset = StudentGrade.objects.filter(
            gradelevel=grade_level_id,
            section=section_id,
            subject=subject_id,
            quarter=quarter_id
        )

        return queryset

class StudentCountView(View):
    def get(self, request):
        student_count = Student.objects.count()
        data = {'student_count': student_count}
        return JsonResponse(data)

class TeacherCountView(View):
    def get(self, request):
        teacher_count = Teacher.objects.count()
        data = {'teacher_count': teacher_count}
        return JsonResponse(data)
    
class WeeklyProgressListCreateView(generics.ListCreateAPIView):
    queryset = WeeklyProgress.objects.all()
    serializer_class = WeeklyProgressSerializer

class getWeeklyProgress(ListAPIView):
    serializer_class = WeeklyProgressSerializer

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        grade_level_id = self.kwargs['grade_level_id'] 
        section_id = self.kwargs['section_id']
        subject_id = self.kwargs['subject_id']
        quarter_id = self.kwargs['quarter_id']

        queryset = WeeklyProgress.objects.filter(
            student_id = student_id,
            gradelvl_id=grade_level_id,
            section_id=section_id,
            subject_id=subject_id,
            quarter_id=quarter_id
        )

        return queryset