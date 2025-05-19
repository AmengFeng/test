from django.db import models

# Create your models here.
from public.models import User


class Video(models.Model):
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="videos")
    title = models.CharField(max_length=255, null=True)
    tags = models.JSONField(default=list)
    description = models.TextField(blank=True, null=True)
    brief = models.TextField(blank=True, null=True)
    video_addr = models.CharField(max_length=255, null=True)
    cover_addr = models.CharField(max_length=255, null=True)
    created_time = models.DateTimeField(auto_now_add=True)
    stared_user = models.ManyToManyField(User, blank=True, related_name="stared_videos")

    class Meta:
        db_table = 'video'
        ordering = ["-created_time"]


class Comment(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField(blank=True)
    created_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "comment"
