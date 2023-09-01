from django.urls import path
from .views import AddStudentView
from django.urls import path
from .views import CustomTokenObtainPairView, UserDataView, AdminRegistrationView, AdminLoginView, AdminTokenObtainPairView, AddTeacherView



urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('add-student/', AddStudentView.as_view(), name='add_student'),
    path('user-data/', UserDataView.as_view(), name='user-data'),
    path('admin-login/', AdminTokenObtainPairView.as_view(), name='admin-login'),
    path('add-admin/', AdminRegistrationView.as_view(), name='add-admin'), 
    path('add-teacher/', AddTeacherView.as_view(), name='add-teacher'), 
]
