from django.urls import path
from .views import AddStudentView
from django.urls import path
from .views import CustomTokenObtainPairView, UserDataView, AdminRegistrationView, AdminTokenObtainPairView, AddTeacherView,  addElemSections,get_departments, get_gradelvl_elem, filter_sections, EditSectionView
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


]
