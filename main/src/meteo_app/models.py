from django.db import models

DIRECTIONS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
              "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]


class ControllerData(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    atm_pressure = models.FloatField(default=None, null=True, blank=True)
    humidity = models.FloatField(default=None, null=True, blank=True)
    temperature_average = models.FloatField(default=None, null=True, blank=True)
    temperature_infrared = models.FloatField(default=None, null=True, blank=True)
    illuminance = models.FloatField(default=None, null=True, blank=True)
    wind_dir_numeric = models.IntegerField(default=None, null=True, blank=True)
    wind_speed = models.FloatField(default=None, null=True, blank=True)
    power_supply = models.FloatField(default=None, null=True, blank=True)
    battery_voltage = models.FloatField(default=None, null=True, blank=True)
    gps_status = models.BooleanField(default=False)
    gps_longitude = models.FloatField(default=None, null=True, blank=True)
    gps_latitude = models.FloatField(default=None, null=True, blank=True)
    gps_altitude = models.FloatField(default=None, null=True, blank=True)

    @property
    def wind_dir_abbr(self):
        if self.wind_dir_numeric is None:
            return None
        index = int((self.wind_dir_numeric + 11.25) / 22.5) % 16
        return DIRECTIONS[index]

    def __str__(self):
        return str(self.timestamp)

    class Meta:
        verbose_name = 'Controller Data'
        verbose_name_plural = 'Controller Data'

