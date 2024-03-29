from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, mixins
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response

from backend.api.authentication import CognitoTokenAuthentication
from .serializers import (
    FeaturedSerializer,
    GPAScoreSerializer,
    PortfolioSerializer,
    AppUserSerializer,
    NewsSerializer,
    ActivitySerializer,
    PushIDSerializer,
)
from .models import (
    AppUser,
    Featured,
    GPAScore,
    News,
    Portfolio,
    PushID,
    Team_Score,
    Activity,
)

import html
import requests_cache
import re
import boto3

CLEANR = re.compile("<.*?>")
client = boto3.client("cognito-idp", region_name="ap-southeast-1")


def cleanhtml(raw_html):
    cleantext = re.sub(CLEANR, "", raw_html)
    return cleantext


class AppUserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    # User must be on Cognito to add their user data here
    authentication_classes = [CognitoTokenAuthentication]

    @action(methods=["GET"], detail=False, url_path="email")
    def getByEmail(self, request):
        user = get_object_or_404(AppUser, email=request.query_params["email"])
        data = AppUserSerializer(user, context={"request": request}).data
        return Response(data, status=200)

    @action(methods=["DELETE"], detail=False, url_path="delete")
    def deleteByEmail(self, request):
        user = get_object_or_404(AppUser, email=request.query_params["email"])
        data = AppUserSerializer(user, context={"request": request}).data
        user_with_email = client.list_users(
            UserPoolId="ap-southeast-1_bzlNrqEFt",
            Filter=f"email = \"{request.query_params['email'].strip()}\"",
        )
        client.admin_delete_user(
            UserPoolId="ap-southeast-1_bzlNrqEFt",
            Username=user_with_email["Users"][0]["Username"],
        )
        self.perform_destroy(user)
        return Response(data, status=200)


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

    unescaped = html.unescape(votd["content"])

    return Response(
        {
            "votd": {
                # Biblegateway returns an escaped html string so we have to unescape it (eg: change &amp; to &)
                "content": cleanhtml(unescaped),
                "display_ref": votd["display_ref"],
            },
            "bg_URL": bg_URL,
        }
    )


@api_view(["GET"])
@permission_classes((permissions.AllowAny,))
def user_exists(request):
    if "email" in request.query_params:
        return Response(
            {
                "exists": AppUser.objects.filter(
                    email=request.query_params["email"]
                ).exists()
            }
        )
    else:
        return Response({"message": "No query parameter"}, status=400)


class PushIDViewSet(
    mixins.CreateModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet
):
    queryset = PushID.objects.all()
    serializer_class = PushIDSerializer
    permission_classes = [permissions.AllowAny]


class GPAScoreViewset(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = GPAScore.objects.all()
    serializer_class = GPAScoreSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CognitoTokenAuthentication]

    @action(methods=["GET"], detail=False, url_path="email")
    def getByEmail(self, request):
        user = get_object_or_404(AppUser, email=request.query_params["email"])
        # Return top 4 objects for that user
        query = GPAScore.objects.filter(user=user).order_by("date_added").reverse()[:4]
        data = GPAScoreSerializer(query, many=True, context={"request": request}).data
        return Response(data, status=200)
