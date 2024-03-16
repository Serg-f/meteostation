from django.urls import path

from . import views

urlpatterns = [
    # path('api/last_controller_data/', views.LastControllerDataAPIView.as_view(), name='last_controller_data'),
    path('api/weather_data_sse/', views.WeatherDataSSEView.as_view(), name='weather_data_sse'),
]
