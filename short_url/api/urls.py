
from django.urls import path, re_path
from rest_framework.urlpatterns import format_suffix_patterns
from short_url.api import views

# API endpoints
urlpatterns = format_suffix_patterns([

    path('', views.UrlAPIListCreateAPIView.as_view(),
        name='url-list'),
    re_path(r'^(?P<user_id>[0-9a-f]{16})/$', views.UrlAPIListCreateAPIView.as_view(),
        name='url-list'),
    # re_path(r'^(?P<user_id>[0-9a-f]{16})/(?P<pk>[\d]+)/$', views.UrlRetrieveAPIView.as_view(),
    #     name='your-new-url'),


])