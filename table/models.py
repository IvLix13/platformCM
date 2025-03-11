from django.db import models
from django.conf import settings
#from django.contrib.auth.models import User

# Create your models here.
class ControlCM(models.Model):
    userlogin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='whose_forms')
    all_forms = models.IntegerField(blank=True, null=True)
    data_forms = models.TextField() # сюда будут скидываться таблицы в формате json из KRIVO
    date_refresh = models.DateField()
    
    def __str__(self):
        return f"{self.userlogin}, {self.date_refresh}"