from django.contrib import admin
from . import models

admin.site.register(
    [
        models.Parent,
        models.PushID,
        models.Staff,
        models.Student,
        models.Post,
        models.Team_Score,
    ]
)
