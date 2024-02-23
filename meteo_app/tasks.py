from celery import shared_task
import requests
from .serializers import ControllerDataSerializer


@shared_task
def fetch_and_save_controller_data():
    delay = 0
    while delay < 60:
        fetch_and_save_controller_data_once.apply_async(countdown=delay)
        delay += 10


@shared_task
def fetch_and_save_controller_data_once():
    response = requests.get('http://localhost:8001')
    if response.status_code == 200:
        data = response.json()
        serializer = ControllerDataSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        else:
            print("Error in data received:", serializer.errors)
    else:
        print(f"Error fetching data: HTTP {response.status_code}")
