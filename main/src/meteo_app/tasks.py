import redis
from celery import shared_task
import requests

import meteostation.settings as settings

from .serializers import ControllerDataSerializer


@shared_task
def fetch_and_save_controller_data():
    delay = 0
    while delay < 60:
        fetch_and_save_controller_data_once.apply_async(countdown=delay)
        delay += settings.CONTROLLER_DATA_PROCESS_DELAY


@shared_task
def fetch_and_save_controller_data_once():
    response = requests.get('http://controller:8001')
    if response.status_code == 200:
        data = response.json()
        serializer = ControllerDataSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            # Publish a message to Redis channel
            r = redis.Redis(host='redis', port=6379, db=0)
            r.publish('weather_data_channel', 'new_data_available')
        else:
            print("Error in data received:", serializer.errors)
    else:
        print(f"Error fetching data: HTTP {response.status_code}")