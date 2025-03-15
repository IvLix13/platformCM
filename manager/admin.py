from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser
from .forms import CustomUserAdminForm
from .forms import CustomUserAdd

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
        
admin.site.register(CustomUser,CustomUserAdmin)

