
from rest_framework import serializers

from short_url.models import Url

class UrlSerializer(serializers.Serializer):

    user_id = serializers.CharField(max_length=16)
    long_url = serializers.URLField(max_length=200)
    short_url_subpart = serializers.SlugField(allow_blank=True, allow_unicode=False, max_length=50, required=False)
    created = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return Url.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.user_id = validated_data.get('user_id', instance.user_id)
        instance.long_url = validated_data.get('long_url', instance.long_url)
        instance.short_url_subpart = validated_data.get('short_url_subpart', instance.short_url_subpart)
        return instance