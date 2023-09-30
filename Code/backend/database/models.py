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
    email = models.EmailField(unique=True) 
    USERNAME_FIELD = 'email'  
    REQUIRED_FIELDS = []  


class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    student_id = models.AutoField(primary_key=True)
    dept_id = models.ForeignKey('Department', on_delete=models.CASCADE)
    gradelvl_id = models.ForeignKey('GradeLevel', on_delete=models.CASCADE)
    section_id = models.ForeignKey('Section', on_delete=models.CASCADE)
    fname = models.CharField(max_length=50)
    mname = models.CharField(max_length=50, blank=True, null=True)
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
    gradelvl_id  = models.ForeignKey('GradeLevel', on_delete=models.CASCADE)
    section_id  = models.ForeignKey('Section', on_delete=models.CASCADE)
    fname = models.CharField(max_length=50)
    mname = models.CharField(max_length=50, blank=True, null=True)
    lname = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=25)
    gender = models.CharField(max_length=10)
    birthdate = models.DateField(default=timezone.now)
    
    def __str__(self):
        return str(self.teacher_id)


class Assigned(models.Model):
    teacher = models.ForeignKey('Teacher', on_delete=models.CASCADE)
    subject_id = models.ForeignKey('Subject', on_delete=models.CASCADE)
    dept_id = models.ForeignKey('Department', on_delete=models.CASCADE)
    gradelvl_id = models.ForeignKey('GradeLevel', on_delete=models.CASCADE)
    section_id = models.ForeignKey('Section', on_delete=models.CASCADE)

    def __str__(self):
        return f"Assignment for Teacher {self.teacher} in {self.subject_id} for {self.dept_id}, Grade {self.gradelvl_id}, Section {self.section_id}"

    class Meta:
        unique_together = ('subject_id', 'dept_id', 'gradelvl_id', 'section_id')


class Admin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, default=1)
    admin_id = models.AutoField(primary_key=True)
    fname = models.CharField(max_length=50, default='')
    mname = models.CharField(max_length=50, default='')
    lname = models.CharField(max_length=50, default='')
    phone = models.CharField(max_length=25, default='')
    gender = models.CharField(max_length=10, default='')
    address = models.CharField(max_length=255, default='')
    profile_picture = models.ImageField(upload_to='admin_profiles/', null=True, blank=True)



class Department(models.Model):
    dept_id = models.AutoField(primary_key=True)
    dept_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.dept_id} - {self.dept_name}"
    
class GradeLevel(models.Model):
    gradelvl_id = models.AutoField(primary_key=True)
    dept_id = models.ForeignKey('Department', on_delete=models.CASCADE)
    gradelvl = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.gradelvl_id} - {self.gradelvl}"
    
class Section(models.Model):
    section_id = models.AutoField(primary_key=True)
    dept_id = models.ForeignKey('Department', on_delete=models.CASCADE)
    gradelvl_id = models.ForeignKey('GradeLevel', on_delete=models.CASCADE)
    section_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.section_id} - {self.section_name}"
    
class Subject(models.Model):
    subject_id = models.AutoField(primary_key=True)
    dept_id = models.ForeignKey('Department', on_delete=models.CASCADE)
    gradelvl_id = models.ForeignKey('GradeLevel', on_delete=models.CASCADE)
    subject_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.subject_id} - {self.subject_name}"
    
class Quarter(models.Model):
    quarter_id = models.AutoField(primary_key=True)
    quarter_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.quarter_id} - {self.quarter_name}"
    
class HpsScores(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    quarter = models.ForeignKey(Quarter, on_delete=models.CASCADE)
    gradelevel = models.ForeignKey(GradeLevel, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)

    hps_ww_1 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_ww_2 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_ww_3 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_ww_4 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_ww_5 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_ww_6 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_ww_7 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_ww_8 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_ww_9 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_ww_10 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    hps_ww_total_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    hps_pt_1 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_pt_2 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_pt_3 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_pt_4 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_pt_5 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_pt_6 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_pt_7 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_pt_8 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_pt_9 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hps_pt_10 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    hps_pt_total_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    hps_qa_total_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)



class StudentGrade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    quarter = models.ForeignKey(Quarter, on_delete=models.CASCADE)
    gradelevel = models.ForeignKey(GradeLevel, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)


    ww_score_1 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ww_score_2 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ww_score_3 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ww_score_4 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ww_score_5 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ww_score_6 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ww_score_7 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ww_score_8 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ww_score_9 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ww_score_10 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    
    ww_total_score = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ww_percentage_score = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ww_weighted_score = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    
    pt_score_1 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    pt_score_2 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    pt_score_3 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    pt_score_4 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    pt_score_5 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    pt_score_6 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    pt_score_7 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    pt_score_8 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    pt_score_9 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    pt_score_10 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    pt_total_score = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    pt_percentage_score = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    pt_weighted_score = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    
    qa_score = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    qa_percentage_score = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    qa_weighted_score = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    
    initial_grade = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    
    quarterly_grade = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

   

    def __str__(self):
        return f" {self.student} in {self.subject}"