from httpx import AsyncClient, ASGITransport
import pytest
from emulator import app


@pytest.mark.asyncio
async def test_read_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    data = response.json()
    expected_keys = {
        'atm_pressure': float,
        'humidity': float,
        'temperature_average': float,
        'temperature_infrared': float,
        'wind_speed': float,
        'illuminance': float,
        'wind_dir_numeric': int,
        'power_supply': float,
        'battery_voltage': float,
        # 'gps_status': bool,
        # 'gps_longitude': float,
        # 'gps_latitude': float,
        # 'gps_altitude': float,
    }
    assert set(data.keys()) == set(expected_keys.keys())
    for k, v in data.items():
        assert isinstance(v, expected_keys[k])
