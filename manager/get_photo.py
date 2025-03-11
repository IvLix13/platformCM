from .models import CustomUser
import os
from django.conf import settings

class GetPhoto():
    def __init__(self, username):
        self.username = username
    
    def get_photo_from_db(self):
        user = CustomUser.objects.get(userlogin=self.username)
        result = os.path.join(settings.MEDIA_ROOT, user.profile_picture.name)
        return result