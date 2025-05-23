# Generated by Django 4.2.11 on 2024-04-25 02:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Demand',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, null=True)),
                ('tags', models.JSONField(default=list)),
                ('description', models.TextField(blank=True, null=True)),
                ('price', models.CharField(max_length=255, null=True)),
                ('created_time', models.DateTimeField(auto_now_add=True)),
                ('creator', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'demand',
                'ordering': ['-created_time'],
            },
        ),
    ]
