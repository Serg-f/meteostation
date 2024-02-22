from django.urls import path

from meteo_app import views

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('settings/', views.SettingsView.as_view(), name='settings'),
    path('sea/', views.SeaView.as_view(), name='sea'),
    path('about/', views.AboutView.as_view(), name='about'),
]
