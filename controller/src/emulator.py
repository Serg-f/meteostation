from fastapi import FastAPI

app = FastAPI()

initial_data = {
    'atm_pressure': 754.5,
    'humidity': 48.25,
    'temperature_average': 19.1,
    'temperature_infrared': 17.47,
    'illuminance': 5.0,
    'wind_dir_numeric': 730,
    'wind_speed': 0.3,
    'power_supply': 5.08,
    'battery_voltage': 0.02,
    # 'gps_status': False,
    # 'gps_longitude': None,
    # 'gps_latitude': None,
    # 'gps_altitude': None
}

counter = 0


@app.get("/")
async def read_root():
    global counter
    counter = counter + 1 if counter < 5 else 0

    controller_data = initial_data.copy()
    for k, v in controller_data.items():
        if isinstance(v, (float, int)):
            controller_data[k] += counter

    return controller_data
