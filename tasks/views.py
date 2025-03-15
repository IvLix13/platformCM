from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import mainTasks
from .serializers import TasksEntrySeializer


def get_start_data_task(user):
    data = mainTasks.objects.filter(who_get_task=user)
    return data

def update_task(task, id, user_set, user_get):
    try:
        task = mainTasks.objects.get(id=id, who_set_task=user_set, who_get_task=user_get)
    except mainTasks.DoesNotExist:
        return Response({"error:":"Task  not found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = TasksEntrySeializer(task, data=task, partial=True)
    if serializer.is_valid():
        serializer.save()
        return serializer.data
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def delete_task(id):
    try:
        task = mainTasks.objects.get(id=id)
    except mainTasks.DoesNotExist:
        return Response({"error": "cannot delete task"})
    task.delete()
    return Response({"message":"task delete"})

def create_task(task):
    serializer = TasksEntrySeializer(data=task)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

