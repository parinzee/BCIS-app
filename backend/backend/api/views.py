from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, mixins
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import (
    FeaturedSerializer,
    PortfolioSerializer,
    UserSerializer,
    NewsSerializer,
    ActivitySerializer,
    PushIDSerializer,
)
from .models import Featured, News, Portfolio, PushID, Team_Score, Activity

import requests_cache


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows news to be viewed
    """

    queryset = News.objects.all().order_by("date_updated").reverse()
    serializer_class = NewsSerializer
    permission_classes = [permissions.AllowAny]


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows activities to be viewed
    """

    queryset = Activity.objects.all().order_by("date_updated").reverse()
    serializer_class = ActivitySerializer
    permission_classes = [permissions.AllowAny]


class PortfolioViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Portfolio.objects.all().order_by("date_updated").reverse()
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.AllowAny]


class FeaturedViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows the featured news to be viewed
    """

    queryset = Featured.objects.all()
    serializer_class = FeaturedSerializer
    permission_classes = [permissions.AllowAny]


@api_view(["GET"])
@permission_classes((permissions.AllowAny,))
def team_scores(request):
    """Lists all the team_scores"""
    scores = Team_Score.objects.all()

    hs_scores = {"red": 0, "green": 0, "blue": 0, "yellow": 0}

    elem_scores = {"red": 0, "green": 0, "blue": 0, "yellow": 0}

    for score in scores:
        selected_dict = None
        if score.department == "E":
            selected_dict = elem_scores
        else:
            selected_dict = hs_scores

        if score.team_color == "R":
            selected_dict["red"] += score.score

        elif score.team_color == "G":
            selected_dict["green"] += score.score

        elif score.team_color == "B":
            selected_dict["blue"] += score.score

        else:
            selected_dict["yellow"] += score.score

    return Response({"hs_scores": hs_scores, "elem_scores": elem_scores})


@api_view(["GET"])
@permission_classes((permissions.AllowAny,))
def verse_of_day(request):
    # Expires in half a day
    session = requests_cache.CachedSession("verse", use_memory=True, expire_after=43200)

    votd = session.get(
        "https://www.biblegateway.com/votd/get/?format=json&version=NIV"
    ).json()["votd"]

    bg_URL = session.get("https://source.unsplash.com/random/?nature").url

    session.close()

    return Response({"votd": votd, "bg_URL": bg_URL})


class PushIDViewSet(
    mixins.CreateModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet
):
    queryset = PushID.objects.all()
    serializer_class = PushIDSerializer
    permission_classes = [permissions.AllowAny]
