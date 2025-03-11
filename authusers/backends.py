import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from manager.models import CustomUser
import logging 
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed

logger = logging.Logger('jwt')

class JWTAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):
        request.user = None
        logger.info(f'Attepmted to jwt-ing:{request}')
        auth_header = request.headers.get("Authorization") 
        if not auth_header:
            return None 
        
        if len(auth_header) == 1:
            return None
        
        elif len(auth_header) > 2:
            return None
        
        #prefix = auth_header
        token = auth_header.split(" ")[1]

        try:
            access_token = AccessToken(token)
            user_id = access_token["user_id"]
            user = CustomUser.objects.get(id=user_id)

            return (user, None)
        except Exception as e:
            raise AuthenticationFailed(f"invalid token: {str(e)}")
        #return self._authenticate_credentials(request, token)

    def authenticate_header(self, request):
        return 'Rearer realm=api'
    
    def _authenticate_credentials(self, request, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
        except Exception:
            logger.info(f'Ошибка аутентификации. Невозможно декдировать токен')
            msg = 'Ошибка аутентификации. Невозможно декдировать токен'
            raise exceptions.AuthenticationFailed(msg)
        
        try:
            user = CustomUser.objects.get(pk=payload['id]'])
        except CustomUser.DoesNotExist:
            logger.info(f'Пользователь не принадлежит этому токену')
            msg = 'Пользователь не принадлежит этому токену'
            raise exceptions.AuthenticationFailed(msg)
        
        if not user.is_active():
            logger.info(f'Данный пользователь деактивирован')
            msg = 'Данный пользователь деактивирован'
            raise exceptions.AuthenticationFailed(msg)
       
        return (user, token)
        
        