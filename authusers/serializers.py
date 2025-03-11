from rest_framework import serializers
from manager.models import CustomUser
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    class Meta:
        model = CustomUser
        fields = ('id', 'userlogin', 'password', 'role')

    def create(self, validate_data):
        user = CustomUser.objects.create(
            username=validate_data['userlogin'],
            role=validate_data.get('role', 'other-user')
        )
        user.set_password(validate_data['password'])
        user.save()
        return user
    
class LoginSerializer(serializers.Serializer):
    userlogin = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):

        password = data.get('password', None)
        user = authenticate(username=data['userlogin'], password=password)
        
        if user in None:
            raise serializers.ValidationError("Invalid credentials")
        return{
            'userlogin':user.username,
            'token':user.token,
        }
    
class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=128,
        write_only=True
    )

    token = serializers.CharField(max_length=255, read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['userlogin', 'password', 'token']

    def create(self, validate_data):
        return CustomUser.objects.create_user(**validate_data)