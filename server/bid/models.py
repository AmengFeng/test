from django.db import models

# Create your models here.
from demand.models import Demand
from public.models import User
from video.models import Video


class Bid(models.Model):
    class Status(models.TextChoices):
        created = ('已创建', '已创建')
        confirmed = ('已确认', '已确认')
        rejected = ('已废弃', '已废弃')

    video_addr = models.JSONField(null=True)
    bidder = models.ForeignKey(User, related_name="bids", on_delete=models.CASCADE, null=True)
    cover_addrs = models.JSONField(default=list)
    demand = models.ForeignKey(Demand, on_delete=models.CASCADE, related_name="bids", blank=True)
    description = models.TextField(null=True)
    created_time = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(null=True, max_digits=10, decimal_places=2)
    status = models.CharField(max_length=255, null=True, choices=Status.choices, default=Status.created)

    class Meta:
        db_table = 'bid'
