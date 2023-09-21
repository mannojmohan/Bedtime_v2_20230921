from rest_framework import pagination, status
from rest_framework.response import Response


class CustomPagination(pagination.PageNumberPagination):
    def get_paginated_response(self, data):
        return Response(
            {
                "count": self.page.paginator.count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "user": self.request.user.id,
                "book": int(self.request.query_params.get("book", 0)),
                "results": data
            }
        )