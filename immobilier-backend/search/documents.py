from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry


from immobilier.models import Immobilier


@registry.register_document
class ImmobilierDocument(Document):

    id = fields.IntegerField(attr="id")

    title = fields.TextField(
        attr="title",
        fields={"raw": fields.TextField()},
    )
    type = fields.TextField(
        attr="type",
        fields={"raw": fields.TextField()},
    )
    transaction = fields.TextField(
        attr="transaction",
        fields={"raw": fields.TextField()},
    )
    city = fields.TextField(
        attr="city",
        fields={"raw": fields.TextField()},
    )
    price = fields.FloatField()
    thumbnail_url = fields.TextField(
        attr="thumbnail_url",
        fields={"raw": fields.TextField()},
    )
    url = fields.TextField(
        attr="url",
        fields={"raw": fields.TextField()},
    )
    created_at = fields.DateField(
        attr="created_at",
        fields={"raw": fields.DateField()},
    )

    source = fields.TextField(
        attr="source",
        fields={"raw": fields.TextField()},
    )

    class Index:
        name = "immobiliers"

    class Django:
        model = Immobilier
