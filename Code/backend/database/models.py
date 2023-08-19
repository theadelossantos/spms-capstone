from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password

class CustomUser(AbstractUser):
    STUDENT = 'student'
    TEACHER = 'teacher'
    ADMIN = 'admin'
    ROLE_CHOICES = [
        (STUDENT, 'Student'),
        (TEACHER, 'Teacher'),
        (ADMIN, 'Admin'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    student_id = models.AutoField(primary_key=True)
    dept_id = models.ForeignKey('Department', on_delete=models.CASCADE)
    gradelvl_id = models.ForeignKey('GradeLevel', on_delete=models.CASCADE)
    section_id = models.ForeignKey('Section', on_delete=models.CASCADE)
    fname = models.CharField(max_length=50)
    mname = models.CharField(max_length=50)
    lname = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=25)
    gender = models.CharField(max_length=10)
    birthdate = models.DateField(default=timezone.now)

    
    def __str__(self):
        return f"{self.fname} {self.lname}"

class Teacher(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    teacher_id = models.AutoField(primary_key=True)
    dept_id = models.ForeignKey('Department', on_delete=models.CASCADE)
    gradelvl_id = models.ForeignKey('GradeLevel', on_delete=models.CASCADE)
    section_id = models.ForeignKey('Section', on_delete=models.CASCADE)
    subject_id = models.ForeignKey('Subject', on_delete=models.CASCADE)
    fname = models.CharField(max_length=50)
    mname = models.CharField(max_length=50)
    lname = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=25)
    gender = models.CharField(max_length=10)
    birthdate = models.DateField(default=timezone.now)


class Admin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    admin_id = models.AutoField(primary_key=True)
    fname = models.CharField(max_length=50, default='')
    mname = models.CharField(max_length=50, default='')
    lname = models.CharField(max_length=50, default='')
    phone = models.CharField(max_length=25, default='')
    gender = models.CharField(max_length=10, default='')
    address = models.CharField(max_length=255, default='')



class Department(models.Model):
    dept_id = models.AutoField(primary_key=True)
    dept_name = models.CharField(max_length=50)

class GradeLevel(models.Model):
    gradelvl_id = models.AutoField(primary_key=True)
    dept_id = models.ForeignKey('Department', on_delete=models.CASCADE)
    gradelvl = models.CharField(max_length=10)

class Section(models.Model):
    section_id = models.AutoField(primary_key=True)
    dept_id = models.ForeignKey('Department', on_delete=models.CASCADE)
    gradelvl_id = models.ForeignKey('GradeLevel', on_delete=models.CASCADE)
    section_name = models.CharField(max_length=50)

class Subject(models.Model):
    subject_id = models.AutoField(primary_key=True)
    dept_id = models.ForeignKey('Department', on_delete=models.CASCADE)
    subject_name = models.CharField(max_length=50)
