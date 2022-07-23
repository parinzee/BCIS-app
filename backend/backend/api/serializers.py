from rest_framework import serializers
from . import models


class AppUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.AppUser
        fields = "__all__"


class NewsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.News
        fields = "__all__"


class ActivitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Activity
        fields = "__all__"


class PortfolioSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Portfolio
        fields = "__all__"


class FeaturedSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Featured
        fields = "__all__"


class Team_ScoreSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Team_Score
        fields = "__all__"


class PushIDSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.PushID
        fields = "__all__"


class GPAScoreSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.SlugRelatedField("email", queryset=models.AppUser.objects.all())

    class Meta:
        model = models.GPAScore
        fields = "__all__"
