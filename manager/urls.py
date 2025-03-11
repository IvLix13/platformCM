from django.urls import path, include
from .views import FirstPageView, PersonalCabinetView

urlpatterns = [
    path('', FirstPageView.as_view(), name='fistEnter'),
    path('index/', PersonalCabinetView.as_view(), name='index')
]