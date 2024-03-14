import redis
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ControllerData
from .serializers import ControllerDataSerializer
from django.http import StreamingHttpResponse
import json
from datetime import datetime
import logging

# Configure logger
logger = logging.getLogger(__name__)


class LastControllerDataAPIView(APIView):
    def get(self, request):
        logger.debug("Fetching the last controller data")
        try:
            last_data = ControllerData.objects.last()
            if last_data:
                serializer = ControllerDataSerializer(last_data)
                response_data = serializer.data
                response_data['wind_dir_abbr'] = last_data.wind_dir_abbr
                logger.info("Successfully fetched and serialized the last controller data")
                return Response(response_data)
            else:
                logger.warning("No last controller data found")
                return Response({"error": "No data available"}, status=404)
        except Exception as e:
            logger.error(f"Error fetching last controller data: {str(e)}", exc_info=True)
            return Response({"error": "Internal server error"}, status=500)


# Function to yield data as it becomes available
def event_stream():
    logger.debug("Starting event stream")
    r = redis.Redis(host='redis', port=6379, db=0)
    pubsub = r.pubsub()
    pubsub.subscribe('weather_data_channel')

    for message in pubsub.listen():
        if message['type'] == 'message':
            try:
                new_data = ControllerData.objects.last()
                if new_data:
                    send_data = ControllerDataSerializer(new_data).data
                    send_data['wind_dir_abbr'] = new_data.wind_dir_abbr
                    yield f"data: {json.dumps(send_data)}\n\n"
                    logger.info(f"Sent new data at {datetime.now()}")
                else:
                    logger.warning("Attempted to send new data but found none")
            except Exception as e:
                logger.error(f"Error during event stream: {str(e)}", exc_info=True)
                break  # Exit the loop if an error occurs


class WeatherDataSSEView(View):
    def get(self, request):
        logger.debug("Request received for WeatherDataSSEView")
        try:
            response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
            logger.info("Weather data SSE stream established")
            return response
        except Exception as e:
            logger.critical(f"Failed to establish SSE stream: {str(e)}", exc_info=True)
            return Response({"error": "Internal server error"}, status=500)
