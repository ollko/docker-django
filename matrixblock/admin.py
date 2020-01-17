from django.contrib import admin

from .models import Video, Article, MainPageBlock


admin.site.register(Video)
admin.site.register(Article)
admin.site.register(MainPageBlock)