from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Featured, News, PushID, Team_Score, Activity, Portfolio


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
        fields = "__all__"


class PortfolioSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Portfolio
        fields = "__all__"


class FeaturedSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Featured
        fields = "__all__"


class Team_ScoreSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Team_Score
        fields = "__all__"


class PushIDSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PushID
        fields = "__all__"
