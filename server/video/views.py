import os
import uuid

from django.conf import settings

# Create your views here.
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer, SerializerMethodField

from Utils.viewset import ModelViewSetPlus, handle_error
from demand.models import Demand
from public.models import User
from video.models import Video, Comment


class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"
        depth = 1


class VideoSerializer(ModelSerializer):
    creator_id = PrimaryKeyRelatedField(source="creator", write_only=True, queryset=User.objects.all())
    stared_user_ids = PrimaryKeyRelatedField(source="stared_user", many=True, required=False,
                                             queryset=User.objects.all())
    wanted_demands_ids = PrimaryKeyRelatedField(source="wanted_demands", many=True, required=False,
                                                queryset=Demand.objects.all())
    comments = CommentSerializer(read_only=True, many=True)

    class Meta:
        model = Video
        fields = "__all__"
        depth = 1


class VideoViewSet(ModelViewSetPlus):
    model = Video
    serializer_class = VideoSerializer
    search_fields = ['title', 'tags', 'creator__name', 'description', 'brief']
    pagination_class = PageNumberPagination
    filterset_fields = {
        "creator__id": ["exact"]
    }

    @action(methods=["post"], detail=False)
    @handle_error()
    def upload_file(self, request, *args, **kwargs):
        file = request.FILES['file']
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        file_name = f"{uuid.uuid4()}{os.path.splitext(file.name)[1]}"
        file_path = os.path.join(upload_dir, file_name)
        with open(file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        return f"/media/uploads/{file_name}"


class CommentViewSet(ModelViewSetPlus):
    model = Comment
