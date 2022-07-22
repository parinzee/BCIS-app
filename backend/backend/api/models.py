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

    def __str__(self) -> str:
        return f"{self.title} - {self.date_updated}"

    def clean(self) -> None:
        if self.thumbnail_URL != None and self.thumbnail_File != None:
            raise ValidationError(
                _(
                    "Thumbnail URL and Thumbnail File may not be filled at the same time."
                )
            )
        elif self.thumbnail_URL == None and self.thumbnail_File == None:
            raise ValidationError(
                _("Either Thumbnail URL or Thumbnail File must be specified")
            )


class Portfolio(models.Model):
    title = models.CharField("title", max_length=60)
    content = models.TextField("conent", max_length=200)
    date_updated = models.DateTimeField("thumbnail_url")
    image_URL = models.FileField("photo")

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
        return f"{self.user} - {self.push_id}"


class Student(models.Model):
    name = models.CharField("name", max_length=50)
    department = models.CharField("department", choices=DEPARTMENT, max_length=2)
    team_color = models.CharField(
        "team color", choices=TEAM_COLORS, max_length=1, blank=True, null=True
    )

    def __str__(self) -> str:
        return f"{self.user}"


class Staff(models.Model):
    name = models.CharField("name", max_length=50)
    team_color = models.CharField(
        "team color", choices=TEAM_COLORS, max_length=1, blank=True, null=True
    )

    def __str__(self) -> str:
        return f"{self.user}"


class Parent(models.Model):
    name = models.CharField("name", max_length=50)

    def __str__(self) -> str:
        return f"{self.user}"
