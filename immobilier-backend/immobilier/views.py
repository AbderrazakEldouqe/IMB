from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ImmobilierSerializer
from .models import Immobilier

# Create your views here.
class ImmobilierList(APIView):
    def get(self, request):
        queryset = Immobilier.objects.all()
        serializer = ImmobilierSerializer(queryset, many=True)
        return Response(serializer.data)
