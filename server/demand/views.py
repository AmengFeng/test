from django.shortcuts import render
from openai import OpenAI

# Create your views here.
from rest_framework.fields import SerializerMethodField
from rest_framework.pagination import PageNumberPagination
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer
from rest_framework.views import APIView

from Utils.viewset import ModelViewSetPlus, handle_error
from bid.models import Bid
from demand.models import Demand
from public.models import User


class DemandSerializer(ModelSerializer):
    creator_id = PrimaryKeyRelatedField(source="creator", write_only=True, queryset=User.objects.all())
    stared_user_ids = PrimaryKeyRelatedField(source="stared_user", required=False, many=True,
                                             queryset=User.objects.all())
    can_bid = SerializerMethodField(read_only=True)

    def get_can_bid(self, obj):
        bids = obj.bids.all()
        return not any(bid.status == Bid.Status.confirmed for bid in bids)

    class Meta:
        model = Demand
        fields = "__all__"
        depth = 1


class DemandViewSet(ModelViewSetPlus):
    model = Demand
    serializer_class = DemandSerializer
    filterset_fields = {
        "creator__id": ['exact']
    }
    search_fields = ['title', 'tags', 'creator__name', 'description']
    pagination_class = PageNumberPagination


class GPTView(APIView):
    permission_classes = []
    authentication_classes = []

    @handle_error()
    def post(self, request, *args, **kwargs):
        client = OpenAI(
            api_key="sk-cahvrinogiboagesbzkcenuwxgooxelsxqscedwonlorkgtu",
            base_url="https://api.siliconflow.cn/v1"
        )
        response = client.chat.completions.create(
            model='deepseek-ai/DeepSeek-R1',
            messages=[
                {
                    "role": "system",
                    "content": f"""
                        你是一个视频策划师和需求分析师，你会把用户的简短视频需求用专业的语言描述成合理的视频策划案
                    """
                },
                {
                    'role': 'user',
                    'content': request.data.get("content")
                }
            ],
        )

        return response.choices[0].message.content
