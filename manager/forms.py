from django import forms
from .models import CustomUser
from django.contrib.auth.forms import UserCreationForm

class CustomUserAdminForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['userlogin', 'f', 'i', 'o', 'rank', 'doljnost', 'role_task']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

class CustomUserAdd(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = fields = ['userlogin', 'f', 'i', 'o', 'rank', 'doljnost', 'role_task']