from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import News, Activity, Portfolio, PushID

import json
import requests


@receiver(post_save, sender=News)
@receiver(post_save, sender=Activity)
@receiver(post_save, sender=Portfolio)
def notify_users(sender, instance, **kwargs):
    if instance.notification:
        headers = {
            "Content-Type": "application/json",
            "Host": "exp.host",
            "Accept-Encoding": "gzip, deflate",
            "Accept": "application/json",
        }

        if sender == News or sender == Activity:
            title = f"{instance.emoji} - {instance.title}"
        else:
            title = instance.title

        # One liner to get all push_ids
        push_ids = list(map(lambda x: x.push_id, list(PushID.objects.all())))

        payload = {
            "to": push_ids,
            "title": title,
            "subtitle": f"New {sender.__name__}!",
            "body": instance.content,
            # Deep link to a specific screen
            "data": json.dumps({"url": f"bcis://{sender.__name__.lower()}"}),
            "ttl": "2419200",
        }

        resp = requests.request(
            "POST",
            "https://exp.host/--/api/v2/push/send",
            headers=headers,
            json=payload,
        )