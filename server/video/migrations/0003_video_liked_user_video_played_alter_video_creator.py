# Generated by Django 4.2.11 on 2024-05-07 01:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('video', '0002_alter_video_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='liked_user',
            field=models.ManyToManyField(blank=True, related_name='liked_videos', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='video',
            name='played',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='video',
            name='creator',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='videos', to=settings.AUTH_USER_MODEL),
        ),
    ]
