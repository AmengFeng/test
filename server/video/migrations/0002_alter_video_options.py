# Generated by Django 4.2.11 on 2024-04-25 02:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('video', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='video',
            options={'ordering': ['-created_time']},
        ),
    ]
