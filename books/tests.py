from django.test import TestCase

# Create your tests here.
import datetime
import decimal
from unittest.mock import patch

from django.core.files.base import ContentFile


from apps.users.models import CustomUser as User
from django.test import TestCase
from django.urls import reverse
from . import testing_utils
from . import models


class TestBooksListView(testing_utils.ViewTestBase, TestCase):
    URL = "/api/books/"
    VIEW_NAME = "books-list"
    DETAIL_VIEW = False
    QUERY_PARAMS = "?"
    UNAUTHENTICATED_CODE = 403

    def setUp(self):
        super().setUp()

        self.book = models.Book.objects.create(title="My Book", description="so interesting")
        self.book2 = models.Book.objects.create(title="My Book 2", description="kinda boring")
        self.book_private = models.Book.objects.create(title="My Book 3", description="secret", public=False)

    def test_valid_content(self):
        response = self.client.get(self.get_url() + self.QUERY_PARAMS)

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "so interesting")
        self.assertContains(response, "kinda boring")
        self.assertNotContains(response, "secret")


class TestBooksDetailView(testing_utils.ViewTestBase, TestCase):
    URL = "/api/books/%s/"
    VIEW_NAME = "books-detail"
    DETAIL_VIEW = True
    QUERY_PARAMS = "?"
    UNAUTHENTICATED_CODE = 403
    PRIVATE = False

    def setUp(self):
        super().setUp()
        self.book = models.Book.objects.create(title="My Book", description="so interesting")

    def get_url(self):
        return self.URL % self.book.pk

    def get_reversed_url(self):
        return reverse(self.VIEW_NAME, args=[self.book.pk])


# Setup for narrations
# - 1 public narration for my first book
# - 1 private narration for the first book
# - 1 narration for book 2


class TestNarrationListView(testing_utils.ViewTestBase, TestCase):
    URL = "/api/narrations/"
    VIEW_NAME = "narrations-list"
    DETAIL_VIEW = False
    QUERY_PARAMS = "?"
    UNAUTHENTICATED_CODE = 403

    def setUp(self):
        super().setUp()

        self.book = models.Book.objects.create(title="My Book", description="so interesting")
        self.customized_book = models.CustomizedBook.objects.create(book=self.book, user=self.user)

        self.book2 = models.Book.objects.create(title="My Book 2", description="kinda boring")

        self.narration_public = models.Narration.objects.create(
            book=self.book,
            public=True,
            narrator_name="Foobar",
            timestamps=[],
            audio=ContentFile(b"...", name="foo.mp3"),
        )

        self.narration_private = models.Narration.objects.create(
            book=self.book,
            public=False,
            narrator_name="Poobar",
            timestamps=[],
            audio=ContentFile(b"...", name="foo2.mp3"),
            customized_book=self.customized_book,
        )

        self.narration_other_book = models.Narration.objects.create(
            book=self.book2,
            public=True,
            narrator_name="Rodrigo",
            timestamps=[],
            audio=ContentFile(b"...", name="boo.mp3"),
        )

    def test_no_book_filtering(self):
        response = self.client.get(self.get_url())
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Foobar")
        self.assertContains(response, "Poobar")
        self.assertContains(response, "Rodrigo")

    def test_per_book_filtering(self):

        response = self.client.get(self.get_url() + f'?book={self.book.pk}')

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Foobar")
        self.assertContains(response, "Poobar")
        self.assertNotContains(response, "Rodrigo")

    def test_hiding_private_content(self):
        user2 = User.objects.create(
                username="anotheruser", email="test2@example.com"
            )
        self.client.force_login(user2)
         
        response = self.client.get(self.get_url())
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Foobar")
        self.assertNotContains(response, "Poobar")
        self.assertContains(response, "Rodrigo")


class TestNarrationsDetailView(testing_utils.ViewTestBase, TestCase):
    URL = "/api/narrations/%s/"
    VIEW_NAME = "narrations-detail"
    DETAIL_VIEW = True
    QUERY_PARAMS = "?"
    UNAUTHENTICATED_CODE = 403
    PRIVATE = True

    def setUp(self):
        super().setUp()
        self.book = models.Book.objects.create(title="My Book", description="so interesting")
        self.customized_book = models.CustomizedBook.objects.create(book=self.book, user=self.user)

        self.narration_private = models.Narration.objects.create(
            book=self.book,
            public=False,
            narrator_name="Poobar",
            timestamps=[],
            audio=ContentFile(b"...", name="foo2.mp3"),
            customized_book=self.customized_book,
        )

    def get_url(self):
        return self.URL % self.narration_private.pk

    def get_reversed_url(self):
        return reverse(self.VIEW_NAME, args=[self.narration_private.pk])


class TestRecordingRequestList(testing_utils.ViewTestBase, TestCase):
    URL = "/api/recording_requests/"
    VIEW_NAME = "recording_requests-list"
    DETAIL_VIEW = False
    QUERY_PARAMS = "?"
    UNAUTHENTICATED_CODE = 403

    def setUp(self):
        super().setUp()

        self.book = models.Book.objects.create(title="My Book", description="so interesting")

        self.recording_request = models.RecordingRequest.objects.create(
            user=self.user,
            book=self.book,
            narrator_name="Uncle Joe",
            custom_note="Billy will really appreciate it, thanks!",
        )

    def test_hiding_private_content(self):
        user2 = User.objects.create(
                username="anotheruser", email="test2@example.com"
            )
        self.client.force_login(user2)
         
        response = self.client.get(self.get_url())
        self.assertEqual(response.status_code, 200)
        self.assertNotContains(response, "Uncle Joe")

    def test_create(self):
        response = self.client.post(
            reverse("recording_requests-list"),
            {
                "book": self.book.pk,
                "narrator_name": "Suzan",
                "custom_note": "please Suzan, you got this",
            },
        )
        self.assertEqual(response.status_code, 201)
        response = self.client.get(self.get_url())
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Suzan, you got this")


class TestRecordingRequestDetailView(testing_utils.ViewTestBase, TestCase):
    URL = "/api/recording_requests/%s/"
    VIEW_NAME = "recording_requests-detail"
    DETAIL_VIEW = True
    QUERY_PARAMS = "?"
    UNAUTHENTICATED_CODE = None
    PRIVATE = False

    def setUp(self):
        super().setUp()
        self.book = models.Book.objects.create(title="My Book", description="so interesting")

        self.recording_request = models.RecordingRequest.objects.create(
            user=self.user,
            book=self.book,
            narrator_name="Uncle Joe",
            custom_note="Billy will really appreciate it, thanks!",
        )

    def get_url(self):
        return self.URL % self.recording_request.pk

    def get_reversed_url(self):
        return reverse(self.VIEW_NAME, args=[self.recording_request.pk])
    

    def test_start_request(self):
        response = self.client.get(self.get_url())
        self.assertContains(response, "New")
       
        response = self.client.post(self.get_url() + "start/")

        self.assertEqual(response.status_code, 200)
        response = self.client.get(self.get_url())
        self.assertContains(response, "Started")

    def test_start_request_unathenticated(self):
        self.client.logout()
        response = self.client.get(self.get_url())
        self.assertContains(response, "New")

        response = self.client.post(self.get_url() + "start/")
        self.assertEqual(response.status_code, 200)
        response = self.client.get(self.get_url())
        self.assertContains(response, "Started")



class TestRecordingsList(testing_utils.ViewTestBase, TestCase):
    URL = "/api/recordings/"
    VIEW_NAME = "recordings-list"
    DETAIL_VIEW = False
    QUERY_PARAMS = "?"
    UNAUTHENTICATED_CODE = 403

    def setUp(self):
        super().setUp()

        self.book = models.Book.objects.create(title="My Book", description="so interesting")

        self.recording_request = models.RecordingRequest.objects.create(
            user=self.user,
            book=self.book,
            narrator_name="Uncle Joe",
            custom_note="Billy will really appreciate it, thanks!",
        )

        self.recording = models.Recording.objects.create(
            user=self.user,
            book=self.book,
            timestamps=[],
            audio=ContentFile(b"...", name="foo2.mp3"),
            request=self.recording_request,
        )

    def test_hiding_private_content(self):
        user2 = User.objects.create(
                username="anotheruser", email="test2@example.com"
            )
        self.client.force_login(user2)
         
        response = self.client.get(self.get_url())
        self.assertEqual(response.status_code, 200)
        self.assertNotContains(response, self.recording_request.pk)

    
    def test_creating_new_with_recording_request(self):
        response = self.client.post(
            reverse("recordings-list"),
            {
                "request": self.recording_request.pk,
                "audio": ContentFile(b"...", name="foo.mp3"),
                "timestamps": '[]',
                "book": self.book.pk,
            },
        )
        self.assertEqual(response.status_code, 201)

        response = self.client.get(
            reverse("recording_requests-detail", args=[self.recording_request.pk]),
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Finished")
    
    def test_creating_new_with_bad_recording_request(self):
        response = self.client.post(
            reverse("recordings-list"),
            {
                "request": "this id doesn't exist",
                "audio": ContentFile(b"...", name="foo.mp3"),
                "timestamps": '[]',
                "book": self.book.pk,
            },
        )
        self.assertEqual(response.status_code, 400)
    
    def test_creating_new_no_recording_request(self):
        response = self.client.post(
            reverse("recordings-list"),
            {
                "audio": ContentFile(b"...", name="foo.mp3"),
                "timestamps": '[]',
                "book": self.book.pk,
            },
        )
        self.assertEqual(response.status_code, 201)

    def test_creating_new_unauthenticated(self):
        self.client.logout()
        response = self.client.post(
            reverse("recordings-list"),
            {
                "request": self.recording_request.pk,
                "audio": ContentFile(b"...", name="foo.mp3"),
                "timestamps": '[]',
                "book": self.book.pk,
            },
        )
        self.assertEqual(response.status_code, 201)

    def test_creating_new_unauthenticated_no_recording_request(self):
        self.client.logout()
        response = self.client.post(
            reverse("recordings-list"),
            {
                "audio": ContentFile(b"...", name="foo.mp3"),
                "timestamps": '[]',
                "book": self.book.pk,
            },
        )
        self.assertEqual(response.status_code, 400)

class TestRecordingsDetailView(testing_utils.ViewTestBase, TestCase):
    URL = "/api/recordings/%s/"
    VIEW_NAME = "recordings-detail"
    DETAIL_VIEW = True
    QUERY_PARAMS = "?"
    UNAUTHENTICATED_CODE = 403
    PRIVATE = True

    def setUp(self):
        super().setUp()
        self.book = models.Book.objects.create(title="My Book", description="so interesting")

        self.recording_request = models.RecordingRequest.objects.create(
            user=self.user,
            book=self.book,
            narrator_name="Uncle Joe",
            custom_note="Billy will really appreciate it, thanks!",
        )
        self.recording = models.Recording.objects.create(
            user=self.user,
            book=self.book,
            timestamps=[],
            audio=ContentFile(b"...", name="foo2.mp3"),
            request=self.recording_request,
        )


    def get_url(self):
        return self.URL % self.recording.pk

    def get_reversed_url(self):
        return reverse(self.VIEW_NAME, args=[self.recording.pk])
    