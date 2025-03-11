from .models import CustomUser

class UploadPhoto():
    def __init__(self, username):
        self.username = username

    def upload_photo(self, file):
        user = CustomUser.objects.get(userlogin=self.username)
        user.profile_picture = file
        user.save()
        return "success"

