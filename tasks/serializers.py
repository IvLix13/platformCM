from rest_framework import serializers
from .models import mainTasks

class TasksEntrySeializer(serializers.ModelSerializer):
    class Meta:
        model = mainTasks
        fileds = ['id', 'who_set_task', 'who_get_task', 'date_start', 'check_time', 'deadline_time', 'count_time_to_deadline', 'feature_task', 'title', 'description', 'completed']