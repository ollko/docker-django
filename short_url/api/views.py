
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
        queryset = Url.objects.all()
        user_id = self.kwargs.get('user_id', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset
