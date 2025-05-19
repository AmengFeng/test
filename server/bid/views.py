from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import action
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from Utils.viewset import ModelViewSetPlus, handle_error
from bid.models import Bid
from demand.models import Demand
from public.models import User


class BidSerializer(ModelSerializer):
    demand_id = PrimaryKeyRelatedField(source="demand", write_only=True, queryset=Demand.objects.all())
    bidder_id = PrimaryKeyRelatedField(source="bidder", write_only=True, queryset=User.objects.all())

    class Meta:
        model = Bid
        fields = "__all__"
        depth = 2


class BidViewSet(ModelViewSetPlus):
    model = Bid
    serializer_class = BidSerializer
    filterset_fields = {
        "demand__creator__id": ["exact"],
        "bidder": ["exact"],
        "status": ['exact']
    }

    @action(methods=['post'], detail=True)
    @handle_error()
    def confirm_bid(self, request, *args, **kwargs):
        final_bid: Bid = self.get_object()
        bids = final_bid.demand.bids.all()

        for bid in bids:
            if bid.id != final_bid.id:
                bid.status = Bid.Status.rejected
                bid.save()
        final_bid.status = Bid.Status.confirmed
        final_bid.save()

        return "success"
