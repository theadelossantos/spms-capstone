from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from .models import Student, Teacher, Admin, GradeLevel
from .serializers import UserSerializer, StudentSerializer, TeacherSerializer, AdminSerializer, CustomTokenObtainPairSerializer, AdminLoginSerializer, AdminTokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import HttpResponse
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
import json
import base64
from django.http import JsonResponse
from .models import Department

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

class AddTeacherView(APIView):
    def post(self, request):
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

def get_gradelvl_elem(request):
    elem_dept = Department.objects.get(dept_id = 1)

    gradelevel = GradeLevel.objects.filter(dept_id = elem_dept)
    data = [{
        'gradelvl_id': grdlvl.gradelvl_id,
        'dept_id': grdlvl.dept_id.dept_id,
        'name': grdlvl.gradelvl
        } for grdlvl in gradelevel] 
    return JsonResponse({'gradelevels': data})

