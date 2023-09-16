from django.urls import path
from .views import AddStudentView
from django.urls import path
from .views import *
from . import views


urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('add-student/', AddStudentView.as_view(), name='add_student'),
    path('edit-student/<int:student_id>/',EditStudentView.as_view(), name='edit-student'),
    path('del-student/<int:student_id>/', views.delete_student, name='delete-student'),
    path('user-data/', UserDataView.as_view(), name='user-data'),
    path('admin-login/', AdminTokenObtainPairView.as_view(), name='admin-login'),
    path('add-admin/', AdminRegistrationView.as_view(), name='add-admin'), 
    path('add-teacher/', AddTeacherView.as_view(), name='add-teacher'), 
    path('filter-teachers/<int:grade_level_id>/', views.filter_teachers, name='filter_teachers'),
    path('filter-hs-teachers/<int:grade_level_id>/', views.filter_hs_teachers, name='filter_hs_teachers'),
    path('filter-shs-teachers/<int:grade_level_id>/', views.filter_shs_teachers, name='filter_shs_teachers'),
    path('edit-teacher/<int:teacher_id>/',EditTeacherView.as_view(), name='edit-teacher'),
    path('del-teacher/<int:teacher_id>/', views.delete_teacher, name='delete-teacher'),
    path('departments/', views.get_departments, name='get-departments'),
    path('gradelevels/',views.get_gradelvl_elem, name='get-gradelevels'),
    path('filter-sections/<int:grade_level_id>/', views.filter_sections, name='filter_sections'),
    path('add-elemsection/', addElemSections.as_view(), name="add-elemsection"),
    path('edit-sections/<int:section_id>/', EditSectionView.as_view(), name='edit-section'),  
    path('del-sections/<int:section_id>/', views.delete_section, name='delete_section'),
    path('filter-hs-sections/<int:grade_level_id>/',views.filter_hs_sections, name='filter-hs-sections'),
    path('hs-gradelevels/', views.get_gradelvl_hs, name='get-hs-gradelevels'),
    path('add-hssection/', addHsSections.as_view(), name='add-hssections'),
    path('filter-shs-sections/<int:grade_level_id>/',views.filter_shs_sections, name='filter-hs-sections'),
    path('shs-gradelevels/', views.get_gradelvl_shs, name='get-hs-gradelevels'),
    path('add-shssection/', addsHsSections.as_view(), name='add-hssections'),
    path('filter-elem-courses/<int:grade_level_id>/', views.filter_elem_courses, name='filter-elem-courses'),
    path('edit-subjects/<int:subject_id>/', EditSubjectView.as_view(), name='edit-subject'),
    path('del-subjects/<int:subject_id>/', views.delete_subject, name='delete-subject'),
    path('add-elem-subject/', addElemSubjects.as_view(), name='add-elem-subject'),
    path('filter-hs-courses/<int:grade_level_id>/', views.filter_hs_courses, name='filter-hs-courses'),
    path('add-hs-subject/', addHsSubjects.as_view(), name='add-hs-subject'),
    path('filter-shs-courses/<int:grade_level_id>/', views.filter_shs_courses, name='filter-shs-courses'),
    path('add-shs-subject/', addsHsSubjects.as_view(), name='add-shs-subject'),
    path('get-gradelvldept/<int:department_id>/', views.get_grade_levels_by_department, name='get-gradelevels-by-department'),
    path('get-sectiondept/<int:department_id>/<int:grade_level_id>/', views.get_sections_by_department, name='get-sections-by-department'),
    path('filter-students/<int:dept_id>/<int:grade_level_id>/<int:section_id>/', views.filter_students, name='filter_teachers'),
    
]
