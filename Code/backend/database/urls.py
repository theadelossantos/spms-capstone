from django.urls import path
from .views import CustomAuthToken
from django.urls import path
from .views import StudentHomepage, TeacherHomepage, AdminHomepage



urlpatterns = [
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('student-home/', StudentHomepage.as_view(), name='student-home'),
    path('teacher-home/', TeacherHomepage.as_view(), name='teacher-home'),
    path('admin-home/', AdminHomepage.as_view(), name='admin-home'),
]
