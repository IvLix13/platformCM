# Generated by Django 4.2 on 2025-01-23 15:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('daily_phrase', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='mainphrase',
            name='userlogin',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='who_phrase', to=settings.AUTH_USER_MODEL),
        ),
    ]
