from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import AllowAny
import jwt
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed

#
# В токены добавить такую вещь:вытаскиваем из человека, проверяем есть ли у него True  кжтому приложению или нет 
# При добавлении челоыека заходим в админку находим этого человека, стави галочку под этим приложением 
# При добавлении приложения надо добавить Permission на это приложение
# Возможно токены и не нужны будут

class RolePermission(BasePermission):
    allowed_roles = []

    def has_permission(self, request, view):
        user_role = getattr(request.user, 'role', None)
        return user_role in self.allowed_roles
    
class IsAllowAny(AllowAny):
    def has_permission(self, request, view):
        return super().has_permission(request, view)

class IsAdmin(RolePermission):
    def has_permission(self, request, view):
        token = request.headers.get('Authorization')
        payload = decode_token(token)
        role = payload.get('user_role')
        if role != 'admin':
            raise AuthenticationFailed("Доступ запрещён")
        return True


class IsBossCM(RolePermission):
    def has_permission(self, request, view):
       token = request.headers.get('Authorization')
       payload = decode_token(token)
       role = payload.get('user_role')
       if role != 'boss-CM':
           raise AuthenticationFailed("Доступ запрещён")
       return True

class IsSimpleCM(RolePermission):
    def has_permission(self, request, view):
       token = request.headers.get('Authorization')
       payload = decode_token(token)
       role = payload.get('user_role')
       if role != 'simple-cm':
           raise AuthenticationFailed("Доступ запрещён")
       return True

class IsOtherUser(RolePermission):
    def has_permission(self, request, view):
       token = request.headers.get('Authorization')
       payload = decode_token(token)
       role = payload.get('user_role')
       if role != 'other-user':
           raise AuthenticationFailed("Доступ запрещён")
       return True

class IsAdminJWTPermission(BasePermission):
    def has_permission(self, request, view):
        token = request.headers.get('Authorization').split()[1]
        payload = AccessToken(token)

        if payload.get('role') == 'admin':
            return True
        return False
    
class IsSimpleCMJWTPermission(BasePermission):
    def has_permission(self, request, view):
        token = request.headers.get('Authorization').split()[1]
        payload = AccessToken(token)

        if payload.get('role') == 'bossCM' or payload.get('role') == 'simple-cm':
            return True
        return False
    
class AccesAppPaltformPermission(BasePermission):
    def has_permission(self, request, view):
       user = request.user
       return user.can_acccess_platform
    
class LDAPGropuPermission(BasePermission):
    def has_permission(self, reques, view):
        pass

def decode_token(token):
    try:
        # Декодирование токена
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Срок действия токена истёк.")
    except jwt.InvalidTokenError:
        raise AuthenticationFailed("Неверный токен.")