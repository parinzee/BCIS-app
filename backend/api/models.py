from django.db import models
from django.contrib.auth.models import AbstractUser


class BaseUser(AbstractUser):
    username = None
    email = models.EmailField("email address", max_length=50, unique=True)
    first_name = models.CharField("first name", max_length=30)
    last_name = models.CharField("last name", max_length=30)

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"


class Parents(BaseUser):
    pass


class Staff(BaseUser):
    pass


class Student(BaseUser):
    STUDENT_TYPES = (
        ("KS", "Kindergarten Student"),
        ("ES", "Elementary Student"),
        ("HS", "Highschool Student"),
    )
    student_type = models.CharField("student type", choices=STUDENT_TYPES)
