from django.urls import path
from . import views

urlpattern = [
    path('', views.phrase_view, name='phrase_view')
]