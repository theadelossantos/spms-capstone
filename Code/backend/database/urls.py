from django.urls import path
from .views import AddStudentView
from django.urls import path
from .views import CustomTokenObtainPairView, UserDataView, AdminRegistrationView, AdminTokenObtainPairView, AddTeacherView,  addElemSections, addHsSections, filter_hs_sections, get_gradelvl_hs, delete_section, get_departments, get_gradelvl_elem, filter_sections, EditSectionView, filter_shs_sections, addsHsSections, get_gradelvl_shs
from . import views


urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('add-student/', AddStudentView.as_view(), name='add_student'),
    path('user-data/', UserDataView.as_view(), name='user-data'),
    path('admin-login/', AdminTokenObtainPairView.as_view(), name='admin-login'),
    path('add-admin/', AdminRegistrationView.as_view(), name='add-admin'), 
    path('add-teacher/', AddTeacherView.as_view(), name='add-teacher'), 
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

]
