
from rest_framework import serializers
from rest_framework.validators import UniqueValidator, UniqueTogetherValidator

from short_url.models import Url


class UrlSerializer(serializers.Serializer):
    user_id = serializers.CharField(max_length=16)
    long_url = serializers.URLField(max_length=200)
    short_url_subpart = serializers.SlugField(
        allow_blank=True,
        allow_unicode=False,
        max_length=50,
        required=False,
        validators=[UniqueValidator(queryset=Url.objects.all(),
        message='Этот subpart уже занят!')])
    created = serializers.DateTimeField(read_only=True)

    class Meta:
        validators = [
            UniqueTogetherValidator(
                queryset = Url.objects.all(),
                fields = ['user_id', 'long_url'],
                message = 'У вас уже есть короткая ссылка для этого url !'
            ),
        ]

    def create(self, validated_data):
        return Url.objects.create(**validated_data)