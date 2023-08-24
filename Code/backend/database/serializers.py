from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Student, Teacher, Admin
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):  
    class Meta:
        model = User
        fields = ['id', 'username','email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False},  
            'role': {'read_only': True}  
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


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
    user = UserSerializer()

    class Meta:
        model = Teacher
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data, role='teacher')
        teacher = Teacher.objects.create(user=user, **validated_data)
        return teacher

class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Admin
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data, role='admin')
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

            try:
                student = Student.objects.get(user = user)
                user_id = student.user_id
            except Student.DoesNotExist:
                user_id = None

            data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "email:": email,
                "role": role,
                "user_id": user_id
            }

            return data

        raise serializers.ValidationError(_("Must include 'email' and 'password'"))


