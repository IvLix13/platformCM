from django.db import models
from django.conf import settings

# Create your models here.
class mainPhrase(models.Model):
    userlogin = models.ForeignKey(settings.AUTH_USER_MODEL, models.CASCADE, related_name='who_phrase')
    current_phrase = models.TextField()
    updated_phrase = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.userlogin}, {self.current_phrase}"
    
class poolPhrase(models.Model):
    pharse = models.TextField()

