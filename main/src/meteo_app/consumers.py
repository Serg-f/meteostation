from channels.generic.websocket import AsyncWebsocketConsumer
import json

from django.db.models import Avg, Count
from django.db.models.functions import TruncMinute
from asgiref.sync import sync_to_async
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware, get_default_timezone


class DashboardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        data = await self.get_data(text_data)
        await self.send(text_data=json.dumps({
            'data': data
        }))

    @sync_to_async
    def get_data(self, text_data):
        from meteo_app.models import ControllerData

        data = json.loads(text_data)
        parameter = data['parameter']
        start_datetime = data['start']
        end_datetime = data['end']

        # Parse the datetime strings to datetime objects
        start_datetime = parse_datetime(start_datetime)
        end_datetime = parse_datetime(end_datetime)

        # Make datetimes timezone-aware
        tz = get_default_timezone()
        start_datetime = make_aware(start_datetime, timezone=tz)
        end_datetime = make_aware(end_datetime, timezone=tz)

        # Query and process data
        queryset = ControllerData.objects.filter(timestamp__range=[start_datetime, end_datetime]).annotate(
            minute=TruncMinute('timestamp')
        ).values('minute').annotate(
            avg_value=Avg(parameter), count=Count('id')
        ).order_by('minute')

        # Limit the number of points to 60 or other desired value
        points_count = queryset.count()
        step = max(int(points_count / 60), 1)
        filtered_data = queryset[::step]

        # Prepare and send the data
        response_data = [{
            "timestamp": record["minute"].strftime("%Y-%m-%d %H:%M"),
            "value": record["avg_value"]
        } for record in filtered_data]

        return response_data
