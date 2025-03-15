from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from manager.serializers import MangerCMEntrySeializer
from .serializers import LoginSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from .serializers import RegistrationSerializer
import logging
from rest_framework.renderers import JSONRenderer
from .renders import UserJSONRenderer
from rest_framework_simplejwt.exceptions import TokenError
import jwt
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from  datetime import datetime, timezone
from datetime import timedelta
from .permissions import IsAllowAny

logger = logging.getLogger('auth')

class RegisterView(APIView):
    permission_classes = [IsAllowAny]
    serializer_class = RegistrationSerializer
    renderer_classes = (UserJSONRenderer, )

    def post(self, request):

        user = request.data.get('userlogin', {})
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        logger.info(f'{user.userlogin} attempting registered')
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class LoginView(TokenObtainPairView):
    permission_classes = (IsAllowAny,)
    renderer_classes = (UserJSONRenderer, )
    serializer_class = LoginSerializer

    def get(self, request):
        return render(request, 'authusers/auth.html')

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        logger.info(f'{username} attempting to logging')
        

        user = authenticate(username=username, password=password)
        logger.info(f'{user} is ')#{user.role}')
        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
        #refresh = RefreshToken.for_user(user)
        
        payload = {
            "user_role": user.role,
            "username": user.userlogin,
            "exp": datetime.now(timezone.utc) + timedelta(days=1),  # Срок жизни токена
            "iat": datetime.now(timezone.utc),
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

        if user.role == 'other-user':
            redirect_url = ''# added ip necessary
        else:
            redirect_url = '/mg/index/'

        logger.info(f'Response for {username}:\nuser:{user};\nrole:{user.role};\nuser_token:{token};\nredirect_url:{redirect_url}.\n')
        
        return Response({
            'username':user.userlogin,
            'role':user.role,
            'user_token':token,
            'redirect_url':redirect_url,
        }, status=status.HTTP_200_OK)
    

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = MangerCMEntrySeializer(user)
        return Response(serializer.data)


class VerifyTokenViewLK(APIView):
    permission_classes = [IsAllowAny]
    
    def decode_token(self, token):
        logger.info(f'token is {token}')
        try:
            # Декодирование токена
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            logger.info('Срок действия токена истёк.')
            raise AuthenticationFailed("Срок действия токена истёк.")
        except jwt.InvalidTokenError:
            logger.info('Неверный токен.')
            raise AuthenticationFailed("Неверный токен.")
        
    def get(self, request):
        logger.info(f'VerifyTokenViewLK is ON')
        token = request.GET.get('token')
        payload = self.decode_token(token)
        role = payload.get('user_role')
        username = payload.get('username')
        logger.info(f'{username} attempted connect to lk')
        if role != 'other-user':
            return Response({"data": {"username":payload.get('username'), "get_url": '/mg/index/', "role":role}}, status=status.HTTP_200_OK)
        
        else: 
            return Response({"data": {"username":payload.get('username'), "get_url": 'http://150.1.202.209:3652/', "role":role}}, status=403)
    

class VerifyTokenView(APIView):
    permission_classes = [AllowAny]

    def decode_token(self, token):
        logger.info(f'token is {token}')
        try:
            # Декодирование токена
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            logger.info('Срок действия токена истёк.')
            raise AuthenticationFailed("Срок действия токена истёк.")
        except jwt.InvalidTokenError:
            logger.info('Неверный токен.')
            raise AuthenticationFailed("Неверный токен.")
#тут разобораться
    def get(self, request,  *args, **kwargs):
        logger.info(f'{request} attempted verify token')
        token = request.GET.get('token')  # Получаем токен из тела запроса
        #token = auth_header.split(' ')[1]
        logger.info(f'Token is {token}')
        payload = self.decode_token(token)
        username = payload.get('username')
        role = payload.get('role')
        # Логика: возвращаем доступы в зависимости от роли
        if role != 'other-user':
            get_url = '/mg/index/'
        else:
            get_url = 'http://150.1.202.209:3652/'
        return Response({"data": {"valid":True, "username":username, "get_url": get_url, "role":role}}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        #logger.info(f'{request.user.userlogin} attempted verify token')
        #auth_header = request.headers.get('Authorization')  # Получаем токен из тела запроса
        #token = auth_header.split(' ')[1]
        token = request.get('token')
        logger.info(f'{token} is recieved')

        try:
            # Расшифровываем токен
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            logger.info("Срок действия токена истёк")
            raise AuthenticationFailed("Срок действия токена истёк")
        except jwt.InvalidTokenError:
            logger.info("Некорректный токен")
            raise AuthenticationFailed("Некорректный токен")

        # Извлекаем логин из токена
        username = payload.get("username")
        if not username:
            logger.info("Логин не найден в токене")
            raise AuthenticationFailed("Логин не найден в токене")

        return Response({"username": username})

        '''  if not token:
            logger.info(f' fall token')
            return Response({"error": "Token is required"}, status=400)

        if request.user:
            logger.info(f'all okay')
            return Response({"valid": True}, status=status.HTTP_200_OK)
        else:
            logger.info(f'unvalid token')
            return Response({"valid": False}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            # Проверяем токен
            validated_token = JWTAuthentication().get_validated_token(token)
            user = JWTAuthentication().get_user(validated_token)
            logger.info(f'{user} attempted verify token {validated_token}')
            return Response({"valid": True, "user": user.username})
        except TokenError as e:
            return Response({"valid": False, "error": str(e)}, status=401)
    '''
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_token(request):
    user = request.user
    return Response({
        'role':user.role,
    })

