from django.db import models
from django.contrib.auth.models import User


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


class Post(models.Model):
    title = models.CharField("title", max_length=50)
    title_emoji = models.CharField("title emoji", max_length=20)
    content = models.TextField("content", max_length=300)
    date_updated = models.DateTimeField("date updated")
    department = models.CharField(
        "department", choices=DEPARTMENT, max_length=2, blank=True, null=True
    )

    def __str__(self) -> str:
        return f"{self.title} - {self.date_updated}"


class PushID(models.Model):
    push_id = models.CharField("exponent push id", max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.user} - {self.push_id}"


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.CharField("department", choices=DEPARTMENT, max_length=2)
    team_color = models.CharField(
        "team color", choices=TEAM_COLORS, max_length=1, blank=True, null=True
    )

    def __str__(self) -> str:
        return f"{self.user}"


class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    team_color = models.CharField(
        "team color", choices=TEAM_COLORS, max_length=1, blank=True, null=True
    )

    def __str__(self) -> str:
        return f"{self.user}"


class Parent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.user}"
