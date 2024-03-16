import json
import logging
from datetime import datetime
from asgiref.sync import sync_to_async
from django.http import StreamingHttpResponse
from django.views import View
from rest_framework.response import Response
import aioredis

from .models import ControllerData
from .serializers import ControllerDataSerializer

# Configure logger
logger = logging.getLogger(__name__)


async def event_stream():
    logger.debug("Starting event stream")
    redis = aioredis.from_url("redis://redis:6379/0", encoding="utf-8", decode_responses=True)
    pubsub = redis.pubsub()

    await pubsub.subscribe('weather_data_channel')

    async for message in pubsub.listen():
        if message['type'] == 'message':
            try:
                new_data = await sync_to_async(ControllerData.objects.last)()
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
    async def get(self, request):
        logger.debug("Request received for WeatherDataSSEView")
        try:
            response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
            logger.info("Weather data SSE stream established")
            return response
        except Exception as e:
            logger.critical(f"Failed to establish SSE stream: {str(e)}", exc_info=True)
            return Response({"error": "Internal server error"}, status=500)
