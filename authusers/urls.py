from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, VerifyTokenView, VerifyTokenViewLK #, TokenCheckView don't use

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('verify-token/', VerifyTokenView.as_view(), name='verify-token'),
    path('verify-token-lk/', VerifyTokenViewLK.as_view(), name='verify-token-lk'),
]