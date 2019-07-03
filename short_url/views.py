from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.sites.shortcuts import get_current_site


class ShortUrlView(TemplateView):
    template_name = 'short_url/short_url.html'

    def get_context_data(self, **kwargs):
        context = super(ShortUrlView, self).get_context_data(**kwargs)
        context['title'] = 'Ведите URL и получите короткую ссылку в виде {}/<subpart>'.format(
            get_current_site(self.request)
            )
        return context
