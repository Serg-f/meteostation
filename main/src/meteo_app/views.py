from threading import Event

import redis
from django.views import View
from django.views.generic import TemplateView
from rest_framework.response import Response
from rest_framework.views import APIView

from meteo_app.models import ControllerData
from meteo_app.serializers import ControllerDataSerializer

from django.http import StreamingHttpResponse
import json
from datetime import datetime
import time


class HomeView(TemplateView):
    template_name = 'home.html'
    extra_context = {'menu': 0}


class SettingsView(TemplateView):
    template_name = 'settings.html'
    extra_context = {'menu': 1}


class SeaView(TemplateView):
    template_name = 'sea.html'
    extra_context = {'menu': 2}


class AboutView(TemplateView):
    template_name = 'about.html'
    extra_context = {'menu': 3}


class LastControllerDataAPIView(APIView):
    def get(self, request):
        last_data = ControllerData.objects.last()
        serializer = ControllerDataSerializer(last_data)
        response_data = serializer.data
        response_data['wind_dir_abbr'] = last_data.wind_dir_abbr
        return Response(response_data)


# Function to yield data as it becomes available
def event_stream():
    r = redis.Redis(host='redis', port=6379, db=0)
    pubsub = r.pubsub()
    pubsub.subscribe('weather_data_channel')

    for message in pubsub.listen():
        if message['type'] == 'message':
            new_data = ControllerData.objects.last()
            if new_data:
                send_data = ControllerDataSerializer(new_data).data
                send_data['wind_dir_abbr'] = new_data.wind_dir_abbr
                yield f"data: {json.dumps(send_data)}\n\n"
                print(f"Sent new data at {datetime.now()}")


class WeatherDataSSEView(View):
    def get(self, request):
        response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
        return response
