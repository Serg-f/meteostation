from datetime import timedelta
import redis
from celery import shared_task
import requests
import logging

import meteostation.settings as settings
from django.utils.timezone import now

from .models import ControllerData
from .serializers import ControllerDataSerializer

# Configure logger
logger = logging.getLogger(__name__)


@shared_task
def fetch_and_save_controller_data():
    delay = 0
    while delay < 60:
        fetch_and_save_controller_data_once.apply_async(countdown=delay)
        delay += settings.CONTROLLER_DATA_PROCESS_DELAY


@shared_task
def fetch_and_save_controller_data_once():
    try:
        response = requests.get('http://controller:8001')
        if response.status_code == 200:
            data = response.json()
            serializer = ControllerDataSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                r = redis.Redis(host='redis', port=6379, db=0)
                r.publish('weather_data_channel', 'new_data_available')
                logger.info("Successfully fetched and saved controller data")
            else:
                logger.error(f"Error in data received: {serializer.errors}")
        else:
            logger.error(f"Error fetching data: HTTP {response.status_code}")
    except Exception as e:
        logger.error(f"Exception in fetch_and_save_controller_data_once: {str(e)}", exc_info=True)


@shared_task
def delete_old_controller_data():
    try:
        ninety_days_ago = now() - timedelta(days=90)
        old_data_count, _ = ControllerData.objects.filter(timestamp__lt=ninety_days_ago).delete()
        logger.info(f"Deleted {old_data_count} old ControllerData entries.")
    except Exception as e:
        logger.error(f"Exception in delete_old_controller_data: {str(e)}", exc_info=True)
