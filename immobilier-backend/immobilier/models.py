from django.db import models

# Create your models here.
class Immobilier(models.Model):
    title = models.CharField(max_length=150, blank=True, null=True)
    type = models.CharField(max_length=150, blank=True, null=True)
    transaction = models.CharField(max_length=150, blank=True, null=True)
    city = models.CharField(max_length=150, blank=True, null=True)
    thumbnail_url = models.URLField()
    url = models.URLField()
    price = models.FloatField(default=0, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    source = models.CharField(max_length=150, blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.title} "
