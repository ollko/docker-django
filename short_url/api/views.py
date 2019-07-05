
from rest_framework import generics
from .serializers import UrlSerializer
from short_url.models import Url


class UrlAPIListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = UrlSerializer

    def get_queryset(self):
        """
        This view should return a list of all the purchases for
        the user as determined by the username portion of the URL.
        """
        user_id = self.kwargs['user_id']
        return Url.objects.filter(user_id=user_id)
