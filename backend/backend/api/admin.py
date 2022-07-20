from django.contrib import admin
from . import models

admin.site.register(
    [
        models.Parent,
        models.PushID,
        models.Staff,
        models.Student,
        models.News,
        models.Team_Score,
        models.Activity,
    ]
)
