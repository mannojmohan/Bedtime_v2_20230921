
import uuid
from .models import Book, Narration, RecordingRequest, RequestStatus, Recording, RequestStatus, CombinedNarrations, CombineVideo
from .serializers import BookSerializer, NarrationSerializer, RecordingRequestSerializer, AddRecordingRequestSerializer, RecordingSerializer, CombinedSerializer, CombineVideoSerializer
from django.db.models import Q, QuerySet
from typing import Type, Union
from apps.users.models import CustomUser as User
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.conf import settings
from moviepy.editor import *
from moviepy.audio import *
import librosa
import tempfile
import soundfile as sf
import os
from django.core.files import File 
import cv2 
from django.core.files.uploadedfile import SimpleUploadedFile

from rest_framework import (
    mixins,
    status,
    viewsets,
)
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
from django.db import transaction
from bedtime.pagination import CustomPagination
from .models import Page


class BookViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `retrieve` actions.
    """

    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_queryset(self) -> QuerySet[Book]:
        #return Book.objects.filter(public=True).prefetch_related("pages")
        return Book.objects.filter(public=True)
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        try:
            key = self.request.query_params.get('key')
            RecordingRequest.objects.get(id=key)
            permission_classes = [AllowAny]
        except RecordingRequest.DoesNotExist:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]


class NarrationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Narration.objects.all()
    serializer_class = NarrationSerializer

    def get_queryset(self) -> QuerySet[Narration]:
        user = self.request.user
        book_id = self.request.query_params.get("book", None)
        queryset = Narration.objects.all()
        if book_id:
            queryset = queryset.filter(book=book_id)
        return queryset.filter(Q(public=True) | Q(customized_book__user=user.pk))


class RecordingRequestViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = RecordingRequest.objects.all()
    serializer_class = RecordingRequestSerializer

    def get_queryset(self) -> QuerySet[RecordingRequest]:
        user = self.request.user
        book_id = self.request.query_params.get("book", None)
        queryset = RecordingRequest.objects.all()
        if book_id:
            queryset = queryset.filter(book=book_id)
        if self.action == "retrieve" or self.action == "start":
            return queryset
        return queryset.filter(user=user.pk)

    def get_serializer_class(
        self,
    ) -> Type[Union[RecordingRequestSerializer, AddRecordingRequestSerializer]]:
        if self.action in ("create"):
            return AddRecordingRequestSerializer
        return RecordingRequestSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def create(self, request, *args, **kwargs):
        assert isinstance(self.request.user, User)
        
        recording_name = Recording.objects.filter(
            narrator_name=request.data['narrator_name'], 
            book=request.data['book'],
            user = self.request.user
        )
        if recording_name:
            return Response({
                'result':{
                    'message':'Recording with this name already exist for this book!',
                }            
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(
            data=request.data, context=self.get_serializer_context()
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'retrieve' or self.action == 'start':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=["post"], permission_classes=[AllowAny])
    def start(self, request, pk):
        req = RecordingRequest.objects.get(pk=pk)
        req.status = RequestStatus.STARTED
        req.save()
        
        return Response( status=status.HTTP_200_OK)
    

class RecordingViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Recording.objects.all()
    serializer_class = RecordingSerializer  
        
    def get_queryset(self) -> QuerySet[Recording]:
        user = self.request.user
        book_id = self.request.query_params.get("book", None)
        if book_id:
            narrations = Narration.objects.filter(book=book_id)
            narrations = narrations.filter(Q(public=True) | Q(customized_book__user=user.id))
            recordings = self.queryset.filter(book=book_id, user=user.id)
            combined_data = list(narrations) + list(recordings)
            self.pagination_class = CustomPagination
            return combined_data
        else:
            queryset = self.queryset.filter(user=user.pk).order_by('-book_id').distinct("book_id")
            return queryset

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        user = self.request.user
        recording_request_id = request.data.get('id', None)
        if recording_request_id or request.user.is_anonymous:
            
            try:
                recording_request = RecordingRequest.objects.get(pk=recording_request_id)
                recording_request.status = RequestStatus.FINISHED
                recording_request.save()  
                request.data['narrator_name'] = recording_request.narrator_name        
                user = recording_request.user
            except RecordingRequest.DoesNotExist: 
                return Response(status=status.HTTP_400_BAD_REQUEST)


        recording_name = Recording.objects.filter(
            narrator_name=request.data['narrator_name'], 
            book=request.data['book'],
            user = user
        )
        if recording_name:
            return Response({
                'result':{
                    'message':'Recording with this name already exist for this book!'
                }            
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(
            data=request.data, context=self.get_serializer_context()
        )

        print(request.data.audio.url)

        serializer.is_valid(raise_exception=True)
        Recording.objects.create(
            user=user, **serializer.validated_data
        )
        headers = self.get_success_headers(serializer.data)

        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class UrlViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def list(self, request):
        base_url = f"{request.scheme}://{request.get_host()}"
        book_id = request.query_params.get('book')
        generated_uuid = uuid.uuid4()
        try:
            book = self.get_queryset().get(id=book_id)
            url = f'{base_url}/request/#/recorder/{book.id}/?key={generated_uuid}'
            return Response(
                {"url": url},
                status=status.HTTP_200_OK
            )
        except Book.DoesNotExist:
            return Response(
                {"error": "Book does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

class CombinedNarrations(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = CombineVideoSerializer
    combinedSerializer = CombinedSerializer
    def create(self, request, *args, **kwargs):
        user = self.request.user
        combined = CombineVideo.objects.filter(book = request.data['book'], user = user)
        ### input : {user, bookId, narrator, pagesUrl={1,2,3}, audioUrl = {1,2,3}}
        ### output: Store each data in CombineVideo and get the urls from CombineVideo and process
        ### the video and audio to store in CombinedNarrations
        
        temp_dir = tempfile.mkdtemp()

        for num, obj in enumerate(combined):
            videoClip = VideoFileClip(obj.pages.url[1:])
            audioClip = AudioFileClip(obj.audio.url[1:])

            audioLength = audioClip.duration
            clipCutoff = 12

            if audioLength < clipCutoff:
                videoClip = videoClip.subclip(0, clipCutoff)
                final_audio = (CompositeAudioClip([videoClip.audio, audioClip]))
                final_audio = final_audio.audio_fadeout(2)
                final_clip = videoClip.set_audio(final_audio)
                

            elif audioLength <= 20:
                videoClip = videoClip.subclip(0, audioLength)
                final_audio = CompositeAudioClip([videoClip.audio, audioClip])
                final_audio = final_audio.audio_fadeout(2)
                final_clip = videoClip.set_audio(final_audio)
                
            output_path = os.path.join(temp_dir, f"combined{num}.mp4")
            final_clip.write_videofile(output_path)
        
        video_files = [f for f in os.listdir(temp_dir) if f.endswith('.mp4')]
        video_clips = [VideoFileClip(os.path.join(temp_dir, file)) for file in video_files]
        final_video = concatenate_videoclips(video_clips, method="compose")
        output_path = os.path.join(temp_dir, "finalCombinedVideo.mp4")
        final_video.write_videofile(output_path)

        narratorName = request.data['narrator']
        with open(output_path, 'rb') as video_file:
            uploaded_file = SimpleUploadedFile('finalVideo.mp4', video_file.read(), content_type='multipart/form-data')

        print("Output Path ==> ", output_path)
        data = {
            'user':user.id,
            'book':request.data.get('book'),
            'narratorName':narratorName,
            'finalVideo': uploaded_file
        }
        print(data)
        combined_serializer = CombinedSerializer(data=data)
        if combined_serializer.is_valid():
            combined_serializer.save()
            return JsonResponse({"status": "success"})
        else:
            print(combined_serializer.errors)
            return JsonResponse({"status": "error", "errors": combined_serializer.errors})
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        ## input: {user, bookid, narrator}  output: {fullcombinedVideo}




    
    