from django.urls import path
from .views import ImmobilierList

urlpatterns = [path("immobilier/all/", ImmobilierList.as_view())]
