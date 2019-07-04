from django.db import models
from django.db.models.signals import pre_save

from secrets import token_urlsafe


class Url(models.Model):
    user_id = models.CharField(max_length = 16)
    long_url = models.URLField(max_length = 200)
    short_url_subpart = models.SlugField(default='subpart', blank = True)
    created = models.DateTimeField(auto_now = True)

    def __str__(self):
        return self.long_url


def pre_save_receiver_url_model(sender, instance, *args, **kwargs):
    if instance.short_url_subpart == 'subpart' or instance.short_url_subpart == '':
        instance.short_url_subpart = token_urlsafe(6)



pre_save.connect(pre_save_receiver_url_model, sender=Url)
