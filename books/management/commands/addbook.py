from django.core.management.base import BaseCommand
from books.models import Book, Page
from pathlib import Path
from django.core.files import File
import json
from django.db import transaction


class Command(BaseCommand):
    help = "Adds book pased on the path"

    def add_arguments(self, parser):
        parser.add_argument("book_path", type=str)

    def handle(self, *args, **options):
        book_path = options.get("book_path")

        metadata_path = Path(book_path + "/book.json")
        with metadata_path.open() as f:
            metadata_lines = f.readlines()
            metadata = json.loads("\n".join(metadata_lines))

        book_title = metadata["title"]
        book_description = metadata["description"]
        pages = metadata["pages"]

        self.stdout.write(self.style.SUCCESS('Successfully found a book at path: "%s"' % book_path))
        if Book.objects.filter(title=book_title).exists():
            self.stdout.write(f"Book with title: {book_title} already exists, exiting early...")
            return

        self._add_book(book_title, book_description, book_path, pages)

        self.stdout.write(self.style.SUCCESS('Successfully added a book "%s"' % book_title))

    @transaction.atomic
    def _add_book(self, title, description, book_path, pages):
        book = Book.objects.create(title=title, description=description)
        for i, page in enumerate(pages):
            label = page[0]
            local_path = page[1]
            raw_path = book_path + "/" + local_path.split("./")[1]
            self.stdout.write(f"Adding page with label: {label}, path: {raw_path}")
            path = Path(raw_path)

            with path.open(mode="rb") as f:
                page = Page(label=label)
                page.image = File(f, name=path.name)
                page.book = book
                page.page_number = i + 1
                page.save()
