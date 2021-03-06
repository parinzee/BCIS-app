from django.db import models
from colorfield.fields import ColorField
from django.forms import ValidationError
from django.utils.translation import gettext_lazy as _


DEPARTMENT = (
    ("K", "Kindergarten"),
    ("E", "Elementary"),
    ("H", "Highschool"),
)

TEAM_COLORS = (
    ("R", "Red Team"),
    ("G", "Green Team"),
    ("B", "Blue Team"),
    ("Y", "Yellow Team"),
)

APP_USERS = (("S", "Student"), ("P", "Parent"), ("T", "Teacher/Staff"))


class Team_Score(models.Model):
    score = models.BigIntegerField("score")
    team_color = models.CharField("team color", choices=TEAM_COLORS, max_length=1)
    # We only want to track scores for Elementary & Highshcool
    department = models.CharField("department", choices=DEPARTMENT[1:], max_length=2)

    def __str__(self) -> str:
        return f"{self.score} - {self.team_color} - {self.department}"


class News(models.Model):
    title = models.CharField("title", max_length=50)
    emoji = models.CharField("title emoji", max_length=20)
    content = models.TextField("content", max_length=300)
    date_updated = models.DateTimeField("date updated")
    department = models.CharField(
        "department", choices=DEPARTMENT, max_length=2, blank=True, null=True
    )

    notification = models.BooleanField("Send Notification to User")

    def __str__(self) -> str:
        return f"{self.title} - {self.date_updated}"


class Activity(models.Model):
    title = models.CharField("title", max_length=50)
    emoji = models.CharField("title emoji", max_length=20)
    content = models.TextField("content", max_length=300)
    date_updated = models.DateTimeField("date updated")
    activity_date = models.DateTimeField("date of activity")

    # Thumbnail can either be a url to external image
    thumbnail_URL = models.URLField("thumbnail url", blank=True, null=True)

    # or uploaded, but not both.
    thumbnail_File = models.FileField("thumbnail file", blank=True, null=True)
    video_URL = models.URLField("video url", blank=True, null=True)

    notification = models.BooleanField("Send Notification to User")

    def __str__(self) -> str:
        return f"{self.title} - {self.date_updated}"


class Portfolio(models.Model):
    title = models.CharField("title", max_length=60)
    content = models.TextField("conent", max_length=200)
    date_updated = models.DateTimeField("thumbnail_url")
    image_URL = models.FileField("photo")
    notification = models.BooleanField("Send Notification to User")

    def __str__(self) -> str:
        return f"{self.title} - {self.date_updated}"


class Featured(models.Model):
    title = models.CharField("title", max_length=30)
    emoji = models.CharField("title emoji", max_length=20)
    redirect_URI = models.URLField("redirect URI")
    bg_color1 = ColorField(default="#FFFFFF")
    bg_color2 = ColorField(default="#FFFFFF")

    def __str__(self) -> str:
        return f"{self.emoji} - {self.title}"


class PushID(models.Model):
    push_id = models.CharField("exponent push id", max_length=100)

    def __str__(self) -> str:
        return f"{self.push_id}"


class AppUser(models.Model):
    name = models.CharField("name", max_length=50)
    email = models.EmailField("email")
    user_type = models.CharField("user type", choices=APP_USERS, max_length=1)
    department = models.CharField(
        "department", choices=DEPARTMENT, max_length=2, blank=True, null=True
    )
    team_color = models.CharField(
        "team color", choices=TEAM_COLORS, max_length=1, blank=True, null=True
    )

    def __str__(self) -> str:
        return f"{self.name} - {self.email}"


class GPAScore(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    date_added = models.DateTimeField("date added")
    gpa = models.DecimalField("cumulative gpa", max_digits=6, decimal_places=3)

    def __str__(self) -> str:
        return f'"{self.gpa}" by {self.user} on {self.date_added}'
