from rest_framework import serializers
from .models import mainPhrase

class PhraseCMEntrySeializer(serializers.ModelSerializer):
    class Meta:
        model = mainPhrase
        fileds = ['userlogin', 'current_phrase', 'updated_phrase']