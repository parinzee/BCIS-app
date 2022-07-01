from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField


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


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.CharField("department", choices=DEPARTMENT, max_length=2)
    team_color = models.CharField(
        "team color", choices=TEAM_COLORS, max_length=1, blank=True, null=True
    )

    push_ids = ArrayField(models.CharField(max_length=60), size=50)


class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    team_color = models.CharField(
        "team color", choices=TEAM_COLORS, max_length=1, blank=True, null=True
    )
    push_ids = ArrayField(models.CharField(max_length=60), size=50)


class Parent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    push_ids = ArrayField(models.CharField(max_length=60), size=50)
