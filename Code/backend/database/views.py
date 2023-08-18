from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from .models import Student, Teacher, Admin 
from .serializers import StudentSerializer, TeacherSerializer, AdminSerializer

# Create your views here.

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data = request.data, 
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, create = Token.objects.get_or_create(user=user)

        role = user.role

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'role': role,
        })


class StudentHomepage(APIView):
    def get(self, request):
        if request.user.role == 'student':
            student = Student.objects.get(user=request.user)
            serializer = StudentSerializer(student)
            return Response(serializer.data)


class TeacherHomepage(APIView):
    def get(self, request):
        if request.user.role == 'teacher':
            teacher = Teacher.objects.get(user=request.user)
            serializer = TeacherSerializer(teacher)
            return Response(serializer.data)

class AdminHomepage(APIView):
    def get(self, request):
        if request.user.role == 'admin':
            admin = Admin.objects.get(user=request.user)
            serializer = AdminSerializer(admin)
            return Response(serializer.data)