from django.urls import path
from .views import AddStudentView
from django.urls import path
from .views import CustomTokenObtainPairView, UserDataView



urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('add-student/', AddStudentView.as_view(), name='add_student'),
    path('user-data/', UserDataView.as_view(), name='user-data')
]
