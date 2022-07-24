from time import time
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from django.utils.translation import gettext_lazy as _

from django.contrib.auth.models import AnonymousUser

import os
from jose import jwk, jwt
from jose.utils import base64url_decode


# We're using this to bypass the Django user model since we're using Cognito
class CognitoUser(AnonymousUser):
    @property
    def is_authenticated(self):
        return True


class CognitoTokenAuthentication(BaseAuthentication):
    keys = [
        {
            "alg": "RS256",
            "e": "AQAB",
            "kid": "E3e3Qo3bI+kX3hIaWxqXSxkbt+t1+2CE5oiIckNlOA0=",
            "kty": "RSA",
            "n": "vGCZfKCogqCKmMXnOq6kLoGIE64UCHQVd6k2J8VINLkm2jnOI3BU5u1Q8Csl5NvSsNzWTuKQbvHmLz7q21SabjKD_pvKxRgt4lFGJAbadIDbdqsGUHzQHAaBJaVUhm32eMapTECbicIQBGCicsQ8XEUu7q2NHiy3UrU7gbvqjf7z9DV9XaTFlIU4S32Jn35BouLshesmFcdCsnxA7m3Ra4psg7ZiZZNrPZTm-rimdqvH5RNqPhs_MzSJ7g0KpEJd2WyCBzObLo_WIBGVo8dlIRJXRr4KvcNvwXZo2oTqQ17kxz1C1HqYFH4sr79UTPkGh0B_NzhaQ_a86ks2dSYjDQ",
            "use": "sig",
        },
        {
            "alg": "RS256",
            "e": "AQAB",
            "kid": "Eb6mi7UDnWUNFJMbku8/oT5S1oB6AVsXRWY5+J8bnAE=",
            "kty": "RSA",
            "n": "nfEWkRZk1VlWJfp-BEvHIDKd7vj0ImJ_MYNj3gRQAUEfHo0f5AV7oC3x4HWD5nYzMcQlyURYQsqpViekTWBcG3vef-6OYzsdQS_Pw4-eEZ-PHftMeBd6-6r-pcmXEZ4gPbA0sk4baLoF9fBOKohdQTPNfbQpuEgBsHHOmWJ-VZrQ3WOHLEPhFS_d9ewVGfUgDLNxvy0zXPqVa1555PoIjjjwDXFHuHqhMj5Or12pjMnymhLwELxGnnRJjyxzKw75z6FNwWqlQFupswGUNjqs1swfxkZsUM10c4qgSFk1orjJjv9CIjH_25QuRRZlm0boqbcSkCchs0RCbW-BPrkEEw",
            "use": "sig",
        },
    ]

    keyword = "Token"

    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if len(auth) == 1:
            msg = _("Invalid token header. No credentials provided.")
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = _("Invalid token header. Token string should not contain spaces.")
            raise exceptions.AuthenticationFailed(msg)

        if not auth or auth[0].lower() != self.keyword.lower().encode():
            return None

        token = auth[1].decode()
        headers = jwt.get_unverified_headers(token)
        kid = headers["kid"]

        key_index = -1
        for i in range(len(self.keys)):
            if kid == self.keys[i]["kid"]:
                key_index = i
                break

        if key_index == -1:
            raise exceptions.AuthenticationFailed()

        public_key = jwk.construct(self.keys[key_index])
        message, encrypted_signature = str(token).rsplit(".", 1)
        decoded_signature = base64url_decode(encrypted_signature.encode("utf-8"))

        if not public_key.verify(message.encode("utf-8"), decoded_signature):
            raise exceptions.AuthenticationFailed()

        claims = jwt.get_unverified_claims(token)

        if time() > claims["exp"]:
            raise exceptions.AuthenticationFailed()

        return (CognitoUser(), None)
