from django.contrib.auth.models import User
from rest_framework import serializers
from .models import News, Team_Score, Activity


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class NewsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = News
        fields = "__all__"


class ActivitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Activity
        fioelds = "__all__"


class Team_ScoreSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Team_Score
        fields = "__all__"
