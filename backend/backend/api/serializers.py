from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Post, Team_Score


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username"]


class PostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Post
        fields = [
            "url",
            "title",
            "title_emoji",
            "content",
            "date_updated",
            "department",
        ]


class Team_ScoreSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Team_Score
        fields = ["url", "score", "team_color", "department"]
