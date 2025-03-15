import jwt
import logging
#django modules
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.http import FileResponse
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.views import TokenObtainPairView
#apps
from table.views import Forms
from manager.persinfo import GetPersInfo
from manager.upload_photo import UploadPhoto
from manager.get_photo import GetPhoto
from tasks.views import get_start_data_task
from tasks.views import update_task
from tasks.views import delete_task
from daily_phrase.get_phrase import GetPhrase
#add other custom modules
from authusers.permissions import IsBossCM, IsAdmin, IsAllowAny, IsSimpleCM

logger = logging.getLogger('api')

# GET-Api for get CM log information from Mysql Database
class TableAPI(APIView):
    permission_class = [IsBossCM, IsAdmin, IsSimpleCM]

    def get(self, request):
        userlogin = request.GET.get('username')
        f = Forms(user=userlogin)
        logger.info("GET request TableView recieved")
        try:
            dataKrivo = f.get_forms(userlogin)
            return Response(dataKrivo)
        except Exception as e:
            logger.error(f"Error in TableView: {e}")
            return Response({"error": "Internal Server Error in TableView"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

####TASKS
# GET-Api for get Task information 
class TaskAPI(APIView):
    def get(self, request):
        logger.info("GET request TaskView recieved")
        try:
            user = 'otherUser'
            data = get_start_data_task(user)
            data = {"message": "here will be taskdata"}
            logger.debug(f"Response data :{data}")
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in TaskView: {e}")
            return Response({"error": "Internal Server Error in TaskView "}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# PUT-Api for update task      
class TaskUpdateAPI(APIView):
    def update_task(self, request):
        logger.info("PUT-request task recieved")
        try:
            resp = update_task(request.task, request.id, request.user_set, request.user_get)
            return resp
        except Exception as e:
            logger.error(f"Error in TaksView update_task:{e}")   
        
# DELETE - Api for delete current finished task 
class TaskDeleteAPI(APIView):
    def delete_task(self, request):
        logger.info("DELETE-request task recievd")
        try:
            resp = delete_task(request.id)
            return resp
        except Exception as e:
            logger.error(f"Error in TaksView delete_task:{e}")   

# CREATE - API for create task for user
class TaskCreateAPI(APIView):
    def create_task(self, request):
        logger.info("CREATE-request task recievd")
        try:
            resp = delete_task(request.id)
            return resp
        except Exception as e:
            logger.error(f"Error in TaksView delete_task:{e}")   
#####

# GET - API fo get Personal info employe
class PersonalInfoAPI(TokenObtainPairView):
    permission_class = [IsBossCM, IsAdmin, IsSimpleCM]

    def get(self, request):
        token = request.GET.get('token')
        logger.info(f"CREATE-request personal info recievd")
        payload = self.decode_token(token)
        username = payload.get('username')
        #self.username = username
        logger.info(f"CREATE-request personal info recievd for {username}")
        getPersInfo = GetPersInfo(username=username)
        get_info_from_db = getPersInfo.get_info()
        logger.info(f" info {get_info_from_db}")
        try:
            return Response({"data":{"rank":get_info_from_db[0], "doljnost":get_info_from_db[1], "f":get_info_from_db[2], "i":get_info_from_db[3], "o":get_info_from_db[4]}}, status=200)
        except Exception as e:
            logger.error(f"Error in PersonalInfoView delete_task:{e}")   
            return Response({"error": {f"Some problem: {e}"}}, status=404)
            
    def decode_token(self, token):
        logger.info(f'token in PersonalInfoAPI is {token}')
        try:
            # Декодирование токена
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            logger.info('Срок действия токена истёк.')
            raise AuthenticationFailed("Срок действия токена истёк.")
        except jwt.InvalidTokenError:
            logger.info('Неверный токен.')
            raise AuthenticationFailed("Неверный токен в personalinfo.")

# GET - API for get random phrase
class GetPhraseAPI(TokenObtainPairView):
    permission_class = [IsBossCM, IsAdmin, IsSimpleCM]

    def get(self, request):
        token = request.GET.get('token')
        logger.info(f"CREATE-request get phrase recievd")
        payload = self.decode_token(token)
        username = payload.get('username')
        logger.info(f"CREATE-request get phrase recievd for {username}")
        get_phrase_daily = GetPhrase()
        phrase_daily = get_phrase_daily.get_some_phrase()
        logger.info(f" info {phrase_daily}")
        try:
            return Response({"data":{"phrase": phrase_daily}}, status=200)
        except Exception as e:
            logger.error(f"Error in GetPhraseAPI delete_task:{e}")   
            return Response({"error": {f"Some problem: {e}"}}, status=404)
            
    def decode_token(self, token):
        logger.info(f'token in PersonalInfoAPI is {token}')
        try:
            # Декодирование токена
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            logger.info('Срок действия токена истёк.')
            raise AuthenticationFailed("Срок действия токена истёк.")
        except jwt.InvalidTokenError:
            logger.info('Неверный токен.')
            raise AuthenticationFailed("Неверный токен в personalinfo.")

####PHOTO
#GET - API for get photo employe
class GetPhotoAPI(TokenObtainPairView):
    permission_class = [IsBossCM, IsAdmin, IsSimpleCM]

    def get(self, request):
        token = request.GET.get('token')
        logger.info(f"CREATE-request get photo recievd")
        payload = self.decode_token(token)
        username = payload.get('username')
        logger.info(f"CREATE-request get photo recievd for {username}")
        get_photo_daily = GetPhoto(username)
        path_photo = get_photo_daily.get_photo_from_db()
        logger.info(f" info picture path {path_photo}")
        try:
            return FileResponse(open(path_photo, 'rb'), content_type='image/jpeg', status=200)
        except Exception as e:
            logger.error(f"Error in photo delete_task:{e}")   
            return Response({"error": {f"No photo: {e}"}}, status=404)
            
    def decode_token(self, token):
        logger.info(f'token in Photo is {token}')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            logger.info('Срок действия токена истёк.')
            raise AuthenticationFailed("Срок действия токена истёк.")
        except jwt.InvalidTokenError:
            logger.info('Неверный токен.')
            raise AuthenticationFailed("Неверный токен в personalinfo.")

#CREATE - API for uploaded employe photo
class UploadPhotoAPI(TokenObtainPairView):
    permission_class = [IsBossCM, IsAdmin, IsSimpleCM]

    def post(self, request):
        token = request.data.get('token')
        logger.info(f"CREATE-request uplaoad photo recievd")
        payload = self.decode_token(token)
        username = payload.get('username')
        file = request.FILES.get('profile_pic')
        upload_photo_c = UploadPhoto(username=username)
        result = upload_photo_c.upload_photo(file)
        logger.info(f"CREATE-request uplaoad photo {result} for {username}")
        return Response({'message': f"Фото успешно загружено {result}"}, status=200)
        
    def decode_token(self, token):
        logger.info(f'token in UploadPhoto is {token}')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            logger.info('Срок действия токена истёк.')
            raise AuthenticationFailed("Срок действия токена истёк.")
        except jwt.InvalidTokenError:
            logger.info('Неверный токен.')
            raise AuthenticationFailed("Неверный токен в personalinfo.")
###PHOTO
     
