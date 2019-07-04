
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from short_url.api import views

# API endpoints
urlpatterns = format_suffix_patterns([
    path('', views.UrlAPIListCreateAPIView.as_view(),
        name='url-list'),
])