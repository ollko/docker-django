"""bitly2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from short_url import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.ShortUrlView.as_view(), name='short-url'),
    re_path(r'^(?P<short_url>[0-9a-zA-Z-_]{8})/$', views.UrlRedirectView.as_view(),
        name='url-list'),
    path('api/', include('short_url.api.urls')),



]


