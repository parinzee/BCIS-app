from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import UserSerializer, PostSerializer
from .models import Post


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class PostsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows posts to be viewed
    """

    queryset = Post.objects.all().order_by("date_posted").reverse()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]
