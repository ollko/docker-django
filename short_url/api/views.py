
from rest_framework import generics
from .serializers import UrlSerializer
from short_url.models import Url


class UrlAPIListCreateAPIView(generics.ListCreateAPIView):
    queryset = Url.objects.all()
    serializer_class = UrlSerializer
