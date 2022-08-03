from django.db.models.signals import post_save
from django.dispatch import receiver
from sentry_sdk import capture_event, capture_exception

from .models import News, Activity, Portfolio, PushID

import json
import requests

from markdown import markdown
from bs4 import BeautifulSoup
from time import sleep


def strip_markdown(text: str) -> str:

    # md -> html -> text since BeautifulSoup can extract text cleanly
    html = markdown(text)

    # extract text
    soup = BeautifulSoup(html, "html.parser")
    cleaned_text = "".join(soup.findAll(text=True))

    return cleaned_text


class PushAPIException(Exception):
    def __init__(self, pushapi_resp, *args) -> None:
        self.pushapi_resp = pushapi_resp
        super().__init__(*args)


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
        push_ids = list(set(map(lambda x: x.push_id, list(PushID.objects.all()))))

        curr_push_ids = []
        for index, push_id in enumerate(push_ids):
            curr_push_ids.append(push_id)

            if index == len(push_ids) - 1 or (index + 1) % 50 == 0:
                payload = {
                    "to": curr_push_ids,
                    "title": title,
                    "body": strip_markdown(instance.content),
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

                if resp.status_code != 200:
                    capture_exception(PushAPIException(resp.text))

                curr_push_ids = []
                sleep(0.1)
