# Generated by Django 4.2.11 on 2024-06-02 17:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('video', '0005_remove_video_liked_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='brief',
            field=models.TextField(blank=True, null=True),
        ),
    ]
