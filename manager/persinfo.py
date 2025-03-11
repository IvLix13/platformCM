from .models import CustomUser

class GetPersInfo():
    def __init__(self, username):
        self.username = username
    
    def get_info(self):
        data = CustomUser.objects.get(userlogin=self.username)
        send_data = [data.rank, data.doljnost, data.f, data.i, data.o]
        return send_data