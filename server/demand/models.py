from django.db import models

# Create your models here.
from public.models import User
from video.models import Video


class Demand(models.Model):
    title = models.CharField(max_length=255, null=True)
    tags = models.JSONField(default=list)
    description = models.TextField(blank=True, null=True)
    brief = models.TextField(blank=True, null=True)
    price = models.CharField(max_length=255, null=True)
    created_time = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="demands")
    stared_user = models.ManyToManyField(User, blank=True, related_name="stared_demands")

    # status = models.CharField(max_length=255, null=True)
    class Meta:
        db_table = 'demand'
        ordering = ["-created_time"]
