from fastapi import FastAPI
from datetime import datetime
import math

app = FastAPI()

# Commented data simulates external sensors that are not available at the weather station
initial_data = {
    'atm_pressure':         {'value': 754.5,    'scale_factor': 0.5},
    'humidity':             {'value': 48.25,    'scale_factor': 0.2},
    'temperature_average':  {'value': 19.1,     'scale_factor': 0.3},
    'temperature_infrared': {'value': 17.47,    'scale_factor': 0.3},
    'illuminance':          {'value': 5.0,      'scale_factor': 0.1},
    'wind_dir_numeric':     {'value': 10,       'scale_factor': 0.05},
    'wind_speed':           {'value': 0.3,      'scale_factor': 0.1},
    'power_supply':         {'value': 5.08,     'scale_factor': 0.05},
    'battery_voltage':      {'value': 0.02,     'scale_factor': 0.01},
    # 'gps_status':         {'value': True},
    # 'gps_longitude':      {'value': -122.419, 'scale_factor': 0.0001},
    # 'gps_latitude':       {'value': 37.7749,  'scale_factor': 0.0001},
    # 'gps_altitude':       {'value': 30.0,     'scale_factor': 0.01},
}

start_time = datetime(2024, 3, 15, 0, 0, 0)


def calculate_fluctuations(elapsed_time_seconds):
    periods = [60, 3600, 86400, 2592000, 31536000]  # Defined periods in seconds
    fluctuations = [math.sin(2 * math.pi * elapsed_time_seconds / period) for period in periods]
    combined_fluctuation = sum(fluctuations) / len(periods)
    return combined_fluctuation


@app.get("/")
async def read_root():
    global start_time

    elapsed_time_seconds = (datetime.now() - start_time).total_seconds()
    combined_fluctuation = calculate_fluctuations(elapsed_time_seconds)

    updated_data = {}
    for k, sensor_data in initial_data.items():
        if k == 'gps_status':  # Handle GPS status separately as it doesn't need fluctuations
            updated_data[k] = sensor_data['value']
        elif k == 'wind_dir_numeric':  # Handle wind direction separately as it needs to be an integer
            updated_data[k] = int(sensor_data['value'] + (combined_fluctuation * sensor_data['scale_factor']))
        else:
            updated_data[k] = sensor_data['value'] + (combined_fluctuation * sensor_data['scale_factor'])

    return updated_data
