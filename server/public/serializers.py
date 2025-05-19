from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from demand.views import DemandSerializer
from public.models import User
from video.views import VideoSerializer


class UserSerializer(ModelSerializer):
    stared_demands = DemandSerializer(many=True, read_only=True)
    stared_videos = VideoSerializer(many=True, read_only=True)
    demands = DemandSerializer(many=True, read_only=True)
    videos = VideoSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = "__all__"
        depth = 1


class RoleTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['name'] = user.name
        return token
