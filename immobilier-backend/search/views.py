from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from search.documents import ImmobilierDocument
from immobilier.serializers import ImmobilierSerializer
from django_elasticsearch_dsl_drf.pagination import LimitOffsetPagination

from django_elasticsearch_dsl_drf.filter_backends import (
    SearchFilterBackend,
    FilteringFilterBackend,
    OrderingFilterBackend,
    DefaultOrderingFilterBackend,
)


class ImmobilierDocumentView(DocumentViewSet):
    document = ImmobilierDocument
    serializer_class = ImmobilierSerializer
    pagination_class = LimitOffsetPagination
    lookup_field = "id"

    filter_backends = [
        SearchFilterBackend,
        FilteringFilterBackend,
        OrderingFilterBackend,
        DefaultOrderingFilterBackend,
    ]

    search_fields = ("type","transaction","source","title", "city")

    filter_fields = {"type": "type.raw", "transaction": "transaction.raw", "source": "source.raw"}

    ordering_fields = {
        "id": "id",
        "price": "price",
    }

    # Specify default ordering
    ordering = "id"

    # ?city__terms=agadir__berrechid (filters with the exact terms)
    # http://127.0.0.1:8000/immobilier-search?search=title|casa (find articles containing the ‘New’ value in their titles)
    # http://127.0.0.1:8000/immobilier-search?ordering=-id
    # http://localhost:8000/immobilier-search?source=marocannonces&source=avito&type=appartement&transaction=vente&limit=1000