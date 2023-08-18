from django.contrib import admin
from .models import Student, Teacher, Admin, GradeLevel, Department, Section, Subject, CustomUser
# Register your models here.

class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'dept_id', 'gradelvl_id', 'section_id', 'fname', 'mname', 'lname', 'address', 'phone', 'gender', 'birthdate')

admin.site.register(Student, StudentAdmin)

class TeacherAdmin(admin.ModelAdmin):
    list_display = ('teacher_id', 'dept_id', 'gradelvl_id', 'section_id', 'subject_id', 'fname', 'mname', 'lname', 'address', 'phone', 'gender', 'birthdate')

admin.site.register(Teacher, TeacherAdmin)


admin.site.register(Admin)

class GradeLevelAdmin(admin.ModelAdmin):
    list_display = ('gradelvl_id', 'dept_id', 'gradelvl')

admin.site.register(GradeLevel, GradeLevelAdmin)

class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('dept_id', 'dept_name')
admin.site.register(Department, DepartmentAdmin)

class SectionAdmin(admin.ModelAdmin):
    list_display = ('section_id','dept_id', 'gradelvl_id','section_name')
admin.site.register(Section, SectionAdmin)

class SubjectAdmin(admin.ModelAdmin):
    list_display = ('subject_id','dept_id', 'subject_name')
admin.site.register(Subject, SubjectAdmin)

admin.site.register(CustomUser)
