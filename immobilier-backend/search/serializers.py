from django_elasticsearch_dsl_drf.serializers import DocumentSerializer

from .documents import ImmobilierDocument


class ImmobilierDocumentSerializer(DocumentSerializer):
    class Meta:
        document = ImmobilierDocument

        fields = ("id", "title", "city", "type", "transaction", "price", "source")
