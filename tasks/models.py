from django.db import models
from django.conf import settings

# Create your models here.
class mainTasks(models.Model):
    who_set_task = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='set_tasks') #кто поставил задачу, отсюда вытаскиваем фио и звание
    who_get_task = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='get_tasks') #кто получил задачу, и на чей странице будет он отображаться
    date_start = models.TextField()
    check_time = models.DateField()
    deadline_time = models.DateField()
    count_time_to_deadline = models.IntegerField() #количество секунд
    feature_task = models.IntegerField() # 0 - начальник , 99 - свои
    title = models.TextField()
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title}, {self.date_start},{self.who_set_task}, {self.who_get_task}"


    