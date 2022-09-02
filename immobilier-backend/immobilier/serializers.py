from rest_framework import serializers

from .models import Immobilier


class ImmobilierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Immobilier
        fields = "__all__"
