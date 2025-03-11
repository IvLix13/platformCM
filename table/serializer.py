from rest_framework import serializers
from .models import ControlCM

class ControlCMEntrySeializer(serializers.ModelSerializer):
    class Meta:
        model = ControlCM
        fileds = ['userlogin', 'all_forms', 'data_forms', 'date_refresh']

class KRIVODataSerialzer(serializers.Serializer):
    Filename = serializers.CharField()
    PptPath = serializers.CharField()
    SlideIndex = serializers.CharField()
    ErrorText = serializers.CharField()
    ErrorDateTime = serializers.TimeField()
    
    