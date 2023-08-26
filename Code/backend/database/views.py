from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from .models import Student, Teacher, Admin 
from .serializers import UserSerializer, StudentSerializer, TeacherSerializer, AdminSerializer, CustomTokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView



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

       
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh_token = response.data['refresh']
        access_token = response.data['access']
        role = response.data['role']
        user_id = response.data['user_id']
        
        response.set_cookie('refresh', refresh_token, httponly=True, secure=True)
        response.set_cookie('access', access_token, httponly=True, secure=True)
        response.set_cookie('role', role, httponly=True, secure=True)
        response.set_cookie('user_id', user_id, httponly=True, secure=True)
        
        
        return response

# Create your views here.

# class CustomAuthToken(ObtainAuthToken):
#     def post(self, request, *args, **kwargs):
#         serializer = self.serializer_class(data = request.data, 
#                                            context={'request': request})
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         token, create = Token.objects.get_or_create(user=user)

#         role = user.role

#         return Response({
#             'token': token.key,
#             'user_id': user.pk,
#             'role': role,
#         })

# class CustomLoginView(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')
#         role = request.data.get('role')

#         user = authenticate(request, username=email, password=password)

#         if user is not None:
#             if role == 'student' and user.is_student:
#                 token, created = Token.objects.get_or_create(user=user)
#                 return Response({'token': token.key})
#             elif role == 'teacher' and user.is_teacher:
#                 token, created = Token.objects.get_or_create(user=user)
#                 return Response({'token': token.key})
#             elif role == 'admin' and user.is_superuser:
#                 token, created = Token.objects.get_or_create(user=user)
#                 return Response({'token': token.key})
#             else:
#                 return Response({'error': 'Invalid role for this user'}, status=status.HTTP_401_UNAUTHORIZED)
#         else:
#             return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        
# class StudentHomepage(APIView):
#     def get(self, request):
#         if request.user.role == 'student':
#             student = Student.objects.get(user=request.user)
#             serializer = StudentSerializer(student)
#             return Response(serializer.data)


# class TeacherHomepage(APIView):
#     def get(self, request):
#         if request.user.role == 'teacher':
#             teacher = Teacher.objects.get(user=request.user)
#             serializer = TeacherSerializer(teacher)
#             return Response(serializer.data)

# class AdminHomepage(APIView):
#     def get(self, request):
#         if request.user.role == 'admin':
#             admin = Admin.objects.get(user=request.user)
#             serializer = AdminSerializer(admin)
#             return Response(serializer.data)