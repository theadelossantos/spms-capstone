from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Student, Teacher, Admin
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate
from .models import Department, Section, GradeLevel, Subject
from django.utils.text import slugify


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):  
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'is_staff', 'is_superuser']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False},  
            'role': {'read_only': True}  
        }

    def create(self, validated_data):
        username = validated_data.get('username')
        if username is None:
            email = validated_data.get('email')
            validated_data['username'] = self.generate_unique_username(email)

        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)

        if user.role != user.ADMIN:
            user.is_staff = False
            user.is_superuser = False

        user.save()
        return user

    def generate_unique_username(self,email):
        return slugify(email)

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(write_only=True)

    class Meta:
        model = Student
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data) 
        student = Student.objects.create(user=user, **validated_data)
        return student


class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer(write_only=True)

    class Meta:
        model = Teacher
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        teacher = Teacher.objects.create(user=user, **validated_data)
        return teacher

class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only = True)

    
class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    is_staff = serializers.ReadOnlyField()
    is_superuser = serializers.ReadOnlyField()

    class Meta:
        model = Admin
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data, role='admin', is_staff=True, is_superuser=True)
        admin = Admin.objects.create(user=user, **validated_data)
        return admin



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    role = serializers.CharField(write_only=True)
    def validate(self, attrs):

        email = attrs.get("email")
        password = attrs.get("password")
        role = attrs.get("role")

        if email and password:
            user = authenticate(self.context['request'], email=email, password=password)

            if user is None:
                raise serializers.ValidationError(_("Invalid Credentials"))

            if role and user.role != role:
                raise serializers.ValidationError(_("Invalid Role"))

            refresh = self.get_token(user)

            if role == "student":
                try:
                    student = Student.objects.get(user=user)
                    user_id = student.user_id
                except Student.DoesNotExist:
                    user_id = None
            elif role == "teacher":
                try:
                    teacher = Teacher.objects.get(user=user)
                    user_id = teacher.user_id
                except Teacher.DoesNotExist:
                    user_id = None
            else:
                raise serializers.ValidationError(_("Invalid Role"))

            payload = {
                "user_id": user_id,
                "email": email,
                "role": role,
                "roles": [role], 
            }

            refresh.payload = payload

            data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "email": email,
                "role": role,
                "user_id": user_id
            }
            print("Token Payload:", payload)
            return data

        raise serializers.ValidationError(_("Must include 'email' and 'password'"))

class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        request = self.context.get('request')
        
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(request, username=email, password=password)

            if user is None:
                raise serializers.ValidationError(_("Invalid Credentials"))

            role = "admin"

            refresh = self.get_token(user)

            try:
                admin = Admin.objects.get(user=user)
                user_id = admin.user_id
            except Admin.DoesNotExist:
                user_id = None

            payload = {
                "user_id": user_id,
                "email": email,
                "role": role,  
                "roles": [role],  
            }

            refresh.payload = payload

            data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "email": email,
                "user_id": user_id,
                "role": role,  
            }
            print("Token Payload:", payload)
            return data

        raise serializers.ValidationError(_("Must include 'email' and 'password'"))


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'
    

class GradeLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeLevel
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

