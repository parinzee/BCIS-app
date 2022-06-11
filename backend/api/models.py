from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# User models


class UserManager(BaseUserManager):
    def create_user(
        self, email, first_name, last_name, user_type, team_color=None, password=None
    ):

        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            user_type=user_type,
            team_color=team_color,
            password=password,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            "Admin",
            "Admin",
            user_type="S",
            team_color=None,
            password=password,
        )

        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    USER_TYPES = (
        ("S", "Staff"),
        ("P", "Parents"),
        ("KS", "Kindergarten Student"),
        ("ES", "Elementary Student"),
        ("HS", "Highschool Student"),
    )
    TEAM_COLORS = (
        ("R", "Red Team"),
        ("G", "Green Team"),
        ("B", "Blue Team"),
        ("Y", "Yellow Team"),
    )

    username = None
    email = models.EmailField("email address", max_length=100, unique=True)
    first_name = models.CharField("first name", max_length=30)
    last_name = models.CharField("last name", max_length=30)
    user_type = models.CharField("student type", choices=USER_TYPES, max_length=2)
    team_color = models.CharField(
        "team color", choices=TEAM_COLORS, max_length=1, blank=True, null=True
    )

    objects = UserManager()

    is_admin = models.BooleanField("is admin", default=False)

    USERNAME_FIELD = "email"

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    def is_staff(self):
        return self.is_admin
