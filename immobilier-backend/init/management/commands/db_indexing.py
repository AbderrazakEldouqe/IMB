from lib2to3.pytree import Base
from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    def handle(self, *args, **kwargs):

        call_command("migrate")
        call_command("makemigrations", "immobilier")
        call_command("migrate")
        call_command("search_index", "--rebuild", "-f")
