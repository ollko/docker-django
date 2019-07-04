from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.sites.shortcuts import get_current_site

from secrets import token_hex


class ShortUrlView(TemplateView):
    template_name = 'short_url/short_url.html'

    def get_context_data(self, **kwargs):
        context = super(ShortUrlView, self).get_context_data(**kwargs)
        context['title'] = 'Ведите URL и получите короткую ссылку в виде {}/<subpart>'.format(
            get_current_site(self.request)
        )
        user_id=self.request.session.get('user_id', 0)
        if not user_id:
            user_id = token_hex(8)
            self.request.session['user_id'] = user_id
        context['user_id'] = user_id
        return context
