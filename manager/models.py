from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from datetime import datetime
from datetime import timedelta
import jwt
from lkdev import settings

# Create your models here.
class ManagerUser(BaseUserManager):
    def create_user(self, userlogin, password, role, role_task):
        user = self.model(userlogin=userlogin)
        user.role_task = role_task
        user.role = role
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, userlogin, password, **extra_fields):
        if password is None:
            raise TypeError('Superuser must have a password')

        
        user = self.create_user(userlogin, password, role='Admin', role_task = 0)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('bossCM', 'BossCM'),
        ('simple-cm', 'SimpleCM'),
        ('other-user', 'OtherUsers'),
    ]
    userlogin = models.CharField(max_length=100, unique=True) #чекнть на правильность
    f = models.TextField(max_length=100)
    i = models.TextField(max_length=100)
    o = models.TextField(max_length=100)
    rank = models.TextField(max_length=100)
    doljnost = models.TextField(max_length=100)
    data_registration = models.DateField(auto_now_add=True)
    role_task = models.IntegerField(default=55)# 0 - начальник, 99 свои
    is_active = models.BooleanField(default=True)
    is_super = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)
    role = models.CharField(max_length=25, choices=ROLE_CHOICES, default='other-user')
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    username = None

    objects = ManagerUser()

    USERNAME_FIELD = 'userlogin'
    REQUIRED_FIELDS = ['role_task']

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customer_group',
        blank=True
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customer_premissions',
        blank=True
    )

    @property
    def token(self):
        return self._generate_jwt_token()

    def __str__(self):
        return f'{self.userlogin}'
    
    def get_full_name(self):
        return self.userlogin
    
    def get_short_name(self):
        return self.userlogin
    
    def get_role(self):
        return self.role
    
    def has_perm(self, perm, obj=None):
        """
        Проверяет, есть ли у пользователя указанное разрешение.
        """
        # Доступен ли пользователь
        if not self.is_active:
            return False

        # Проверка на суперпользователя
        if self.is_superuser:
            return True

        # Проверка по ролям (пример с кастомной логикой)
        if self.role == 'Admin':
            return True  # Все разрешения для администратора

        # Дополнительная кастомная логика (можно подключить группы или другое)
        # Например, проверка по базе данных
        return super().has_perm(perm, obj=obj)