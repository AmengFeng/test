from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from rest_framework.routers import SimpleRouter

from bid.views import BidViewSet
from demand.views import DemandViewSet, GPTView
from log.views import LogViewSet
from public.views import LoginView, UserViewSet
from video.views import VideoViewSet, CommentViewSet

router = SimpleRouter()
router.register(r"user", UserViewSet, basename="user")
router.register(r"log", LogViewSet, basename="log")
router.register(r"demand", DemandViewSet, basename="demand")
router.register(r"video", VideoViewSet, basename="video")
router.register(r"comment", CommentViewSet, basename="comment")
router.register(r"bid", BidViewSet, basename="bid")
urlpatterns = [
                  path(r"login/", LoginView.as_view()),
                  path(r"gpt/", GPTView.as_view()),
              ] + router.urls + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
