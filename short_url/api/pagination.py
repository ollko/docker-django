from django.conf import settings
from rest_framework import pagination


class PaginationWithTotalPages(pagination.PageNumberPagination):
    def get_paginated_response(self, data):
        response = super(PaginationWithTotalPages, self).get_paginated_response(data)
        response.data['total_pages'] = self.page.paginator.num_pages
        return response
