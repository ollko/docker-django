from django.shortcuts import render
from django.views.generic import TemplateView, RedirectView
from django.contrib.sites.shortcuts import get_current_site
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.core.cache import cache

from secrets import token_hex

from short_url.models import Url

class ShortUrlView(TemplateView):
    template_name = 'short_url/short_url.html'

    def get_context_data(self, **kwargs):
        context = super(ShortUrlView, self).get_context_data(**kwargs)
        context['title1'] = 'Ведите URL и получите короткую ссылку в виде :'
        context['title2'] = '{}/<subpart>'.format(
            get_current_site(self.request)
        )
        user_id=self.request.session.get('user_id', 0)
        if not user_id:
            user_id = token_hex(8)
            self.request.session['user_id'] = user_id
        context['user_id'] = user_id
        return context


class UrlRedirectView(RedirectView):

    def get_redirect_url(self, *args, **kwargs):
        try:
            short_url = kwargs['short_url']
        except KeyError:
            raise Http404()
        long_url = cache.get( short_url )
        if long_url:
            return long_url
        else:
            obj = get_object_or_404(Url, short_url_subpart = short_url)
            long_url = obj.long_url
            cache.set(short_url, obj.long_url)
            return long_url
