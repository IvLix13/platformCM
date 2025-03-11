from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

class MangerCMEntrySeializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fileds = ['userlogin', 'f', 'i', 'o', 'rank', 'doljnost', 'data_registration', 'role_task', 'role', 'profile_picture']

class PictureProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['profile_picture']

