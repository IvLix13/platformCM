from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser
from django import forms
from .forms import CustomUserAdminForm
from .forms import CustomUserAdd

#adminCM
#12345678


class CustomUserAdmin(BaseUserAdmin):
        
        model = CustomUser
        form = CustomUserAdminForm
        add_form = CustomUserAdd

        list_display = ('id','userlogin', 'rank', 'doljnost', 'f', 'i', 'o', 'data_registration', 'role_task', 'is_active', 'is_super', 'is_staff', 'role')
        search_fields = ('is_staff','userlogin', 'f')
        list_filter = ('is_active', 'role_task')
        ordering = ('userlogin',)
        
        fieldsets = (
             (None, {'fields':('userlogin','f','i', 'o', 'rank', 'doljnost', 'role_task', 'role')}),
             ('Permissions', {'fields':('is_staff','is_super', 'is_active')}),
        )
       
        filter_horizontal = ('user_permissions',)
        add_fieldsets = (
             (None, {'fields':('userlogin','password1','password2' ,'f','i', 'o', 'rank', 'doljnost', 'role_task', 'role')}),
             ('Permissions', {'fields':('is_staff','is_super', 'is_active')})
        )
       
        """
    list_display = ('username', 'rank', 'doljnost', 'data_registraion', 'role_task')
    fieldsets = BaseUserManager.fieldsets + (
        (None, {'fields': ('f', 'i', 'o', 'role_task')}),
    )
    add_fieldsets = BaseUserManager.add_fieldsets + (
        (None, {'fields': ('data_registraion')}),
    )
"""
admin.site.register(CustomUser,CustomUserAdmin)

