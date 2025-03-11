from rest_framework.views import APIView
from django.shortcuts import render
from .models import CustomUser
from .serializers import MangerCMEntrySeializer
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from authusers.permissions import IsAdmin, IsBossCM, IsSimpleCM, IsAllowAny
#from rest_framework.permissions import AllowAny

class FirstPageView(APIView):
        permission_classes = [IsAllowAny]
        def get(self, request):
                return render(request, 'manager/first.html')
    

class PersonalCabinetView(TokenObtainPairView):
        permission_classes = [IsAllowAny]
        #authentication_classes = [JWTAuthentication]
        def get(self, request):
                return render(request, 'manager/index.html')
