from django.urls import path, include
from .views import TableAPI, TaskAPI, PersonalInfoAPI, GetPhraseAPI, GetPhotoAPI, UploadPhotoAPI

#
urlpatterns = [
    path('get_table/', TableAPI.as_view(), name='table-api'), # тут надо будет подумать как принять имя юзера из регистрации
    path('get_task/', TaskAPI.as_view(), name='task-api'), # тут надо будет подумать как принять имя юзера из регистрации
    path('get_perinfo/', PersonalInfoAPI.as_view(), name='persinfo-api'),
    path('get_phrase/', GetPhraseAPI.as_view(), name='phrase-api'),
    path('get_photo/', GetPhotoAPI.as_view(), name='photo-api'),
    path('upload_photo/', UploadPhotoAPI.as_view(), name='upload-photo-api'),
]