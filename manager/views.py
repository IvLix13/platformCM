from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from authusers.permissions import IsAdmin, IsBossCM, IsSimpleCM, IsAllowAny

class FirstPageView(APIView):
        permission_classes = [IsAllowAny]
        def get(self, request):
                return render(request, 'manager/first.html')
    

class PersonalCabinetView(TokenObtainPairView):
        permission_classes = [IsAllowAny]
        def get(self, request):
                return render(request, 'manager/index.html')
