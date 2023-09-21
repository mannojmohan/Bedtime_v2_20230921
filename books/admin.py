from django.contrib import admin
from .models import Book, CustomizedBook, Narration, Page, RecordingRequest, Recording, CombinedNarrations, CombineVideo, Narrator

admin.site.register(Book)
admin.site.register(CustomizedBook)
admin.site.register(Narration)
admin.site.register(Page)
admin.site.register(RecordingRequest)
admin.site.register(Recording)
admin.site.register(CombinedNarrations)
admin.site.register(CombineVideo)
admin.site.register(Narrator)