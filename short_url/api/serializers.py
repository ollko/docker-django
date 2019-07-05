
from rest_framework import serializers

from short_url.models import Url

class UrlSerializer(serializers.ModelSerializer):

    class Meta:
        model = Url
        fields = ('user_id', 'long_url', 'short_url_subpart', 'created')
