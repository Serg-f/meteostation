from django.test import TestCase, Client
from django.urls import reverse
from .models import ControllerData
from channels.testing import WebsocketCommunicator, ChannelsLiveServerTestCase
from .consumers import DashboardConsumer


# Models Test
class ControllerDataModelTest(TestCase):
    def test_wind_dir_abbr(self):
        # Creating a sample ControllerData instance
        data_instance = ControllerData(wind_dir_numeric=45)
        self.assertEqual(data_instance.wind_dir_abbr, "NE",
                         "The wind_dir_abbr property did not return the expected abbreviation for a given numeric direction.")


# Views Test
class WeatherDataSSEViewTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_get(self):
        response = self.client.get(reverse('weather_data_sse'))
        self.assertEqual(response.status_code, 200,
                         "The WeatherDataSSEView did not return a status code of 200.")


# Consumers Test
class DashboardConsumerTest(ChannelsLiveServerTestCase):
    async def test_dashboard_consumer_async(self):
        communicator = WebsocketCommunicator(DashboardConsumer.as_asgi(), "/ws/dashboard/")
        connected, _ = await communicator.connect()
        self.assertTrue(connected, "The websocket connection failed to connect.")

        # Sending a sample data request
        await communicator.send_json_to(
            {"parameter": "temperature_average", "start": "2021-01-01T00:00", "end": "2021-01-02T00:00"})

        response = await communicator.receive_json_from()
        self.assertIn("data", response, "The response from the server did not contain 'data' key as expected.")

        await communicator.disconnect()