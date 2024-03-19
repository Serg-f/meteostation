from fastapi import FastAPI
from datetime import datetime
import math
import random

app = FastAPI()

initial_data = {
    'atm_pressure': {'value': 754.5, 'scale_factor': 0.5},
    'humidity': {'value': 48.25, 'scale_factor': 0.2},
    'temperature_average': {'value': 19.1, 'scale_factor': 0.3},
    'temperature_infrared': {'value': 17.47, 'scale_factor': 0.3},
    'illuminance': {'value': 5.0, 'scale_factor': 0.1},
    'wind_dir_numeric': {'value': 10, 'scale_factor': 0.05},
    'wind_speed': {'value': 0.3, 'scale_factor': 0.1},
    'power_supply': {'value': 5.08, 'scale_factor': 0.05},
    'battery_voltage': {'value': 0.02, 'scale_factor': 0.01},
    # 'gps_status':         {'value': True},
    # 'gps_longitude':      {'value': -122.419, 'scale_factor': 0.0001},
    # 'gps_latitude':       {'value': 37.7749,  'scale_factor': 0.0001},
    # 'gps_altitude':       {'value': 30.0,     'scale_factor': 0.01},
}

start_time = datetime(2024, 3, 15, 0, 0, 0)


def calculate_fluctuations(elapsed_time_seconds, sensor_name):
    periods = [60, 3600, 86400, 2592000, 31536000]  # Different periods for fluctuations
    random.seed(hash(sensor_name))  # Seed with the hash of the sensor's name

    # Generate biases for different time scales
    biases = [random.uniform(-0.2, 0.2) for _ in periods]  # More significant biases

    # Calculate fluctuations for each period and apply the biases
    fluctuations = [
        math.sin(2 * math.pi * elapsed_time_seconds / period) * bias
        for period, bias in zip(periods, biases)
    ]

    # Combine all fluctuations
    combined_fluctuation = sum(fluctuations) / len(periods)

    return combined_fluctuation


@app.get("/")
async def read_root():
    global start_time

    elapsed_time_seconds = (datetime.now() - start_time).total_seconds()

    updated_data = {}
    for k, sensor_data in initial_data.items():
        combined_fluctuation = calculate_fluctuations(elapsed_time_seconds, k)

        if k == 'gps_status':  # GPS status doesn't need fluctuations
            updated_data[k] = sensor_data['value']
        elif k == 'wind_dir_numeric':  # Wind direction to be an integer
            updated_data[k] = int(
                sensor_data['value'] + (combined_fluctuation * sensor_data['scale_factor'] * 10)) % 360
        else:
            updated_data[k] = sensor_data['value'] + (combined_fluctuation * sensor_data['scale_factor'] * 10)

    return updated_data
