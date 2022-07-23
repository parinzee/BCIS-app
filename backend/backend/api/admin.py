from django.contrib import admin
from . import models

admin.site.register(
    [
        models.AppUser,
        models.PushID,
        models.News,
        models.Team_Score,
        models.Activity,
        models.Featured,
        models.Portfolio,
    ]
)
