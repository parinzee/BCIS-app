from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "backend.api"

    def ready(self) -> None:
        # Implicitly register our callbacks/signal recievers
        from . import callbacks
