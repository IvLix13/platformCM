from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class CustomAuthBackend(ModelBackend):
    def authenticate(self, request, userlogin = None, password = None, **kwargs):
        try:
            user = get_user_model().objects.get(userlogin=userlogin)
            if user.check_password(password):
                return user
        except get_user_model().DoesNotExist:
            return None