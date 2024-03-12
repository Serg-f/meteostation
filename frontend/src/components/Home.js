// src/components/Home.js
import React, { useEffect, useState } from 'react';
import BaseLayout from './BaseLayout';
import '../css/home.css';

const Home = () => {
    const [weatherData, setWeatherData] = useState({
        atm_pressure: "N/A",
        humidity: "N/A",
        temperature_average: "N/A",
        temperature_infrared: "N/A",
        illuminance: "N/A",
        wind_dir_numeric: "N/A",
        wind_dir_abbr: "N/A",
        wind_speed: "N/A",
        power_supply: "N/A",
        battery_voltage: "N/A",
        gps_status: "No Data",
        gps_longitude: "No Data",
        gps_latitude: "No Data",
        gps_altitude: "No Data",
        timestamp: "No Data"
    });

    useEffect(() => {
        let eventSource = new EventSource('http://localhost:8000/api/weather_data_sse/');

        eventSource.onmessage = function (event) {
            const newData = JSON.parse(event.data);
            if (newData.error) {
                console.error("Error from server:", newData.error);
                alert("Error retrieving data from server: " + newData.error);
            } else {
                // Filter out any parameters that are 'None' or absent
                const filteredData = Object.keys(newData).reduce((acc, key) => {
                    if (newData[key] !== null && newData[key] !== undefined) {
                        acc[key] = newData[key];
                    }
                    return acc;
                }, {});

                setWeatherData(prevData => ({ ...prevData, ...filteredData }));
            }
        };

        eventSource.onerror = function () {
            console.error("SSE error:");
            eventSource.close();
            setTimeout(() => {
                eventSource = new EventSource('http://localhost:8000/api/weather_data_sse/');
            }, 5000);
        };

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, []);

    return (
        <BaseLayout>
            <div className="row justify-content-center">
                {/* Weather Parameters Card */}
                <div className="col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-header">Weather Parameters</div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <span className="parameter">Atmosphere Pressure:</span>
                                <span className="value-container">
                                    <span className="value">{weatherData.atm_pressure}</span>
                                    <span className="unit">mm</span>
                                </span>
                            </li>
                            <li className="list-group-item">
                                <span className="parameter">Humidity:</span>
                                <span className="value-container">
                                    <span className="value">{weatherData.humidity}</span>
                                    <span className="unit">%</span>
                                </span>
                            </li>
                            <li className="list-group-item">
                                <span className="parameter">Temperature (Average):</span>
                                <span className="value-container">
                                    <span className="value">{weatherData.temperature_average}</span>
                                    <span className="unit">°C</span>
                                </span>
                            </li>
                            <li className="list-group-item">
                                <span className="parameter">Temperature (InfraRed):</span>
                                <span className="value-container">
                                    <span className="value">{weatherData.temperature_infrared}</span>
                                    <span className="unit">°C</span>
                                </span>
                            </li>
                            <li className="list-group-item">
                                <span className="parameter">Illumination:</span>
                                <span className="value-container">
                                    <span className="value">{weatherData.illuminance}</span>
                                    <span className="unit">Lux</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Wind & Power Card */}
                <div className="col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-header">Wind & Power</div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <span className="parameter">Weathervane Direction:</span>
                                <span className="value-container">
                                    <span className="value">{weatherData.wind_dir_numeric}</span>
                                    <span className="value">{weatherData.wind_dir_abbr}</span>
                                </span>
                            </li>
                            <li className="list-group-item">
                                <span className="parameter">Anemometer:</span>
                                <span className="value-container">
                                    <span className="value">{weatherData.wind_speed}</span>
                                    <span className="unit">m/s</span>
                                </span>
                            </li>
                            <li className="list-group-item">
                                <span className="parameter">Power Supply:</span>
                                <span className="value-container">
                                    <span className="value">{weatherData.power_supply}</span>
                                    <span className="unit">V</span>
                                </span>
                            </li>
                            <li className="list-group-item">
                                <span className="parameter">Battery Voltage:</span>
                                <span className="value-container">
                                    <span className="value">{weatherData.battery_voltage}</span>
                                    <span className="unit">V</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* GPS Information Card */}
                <div className="col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-header">GPS Information</div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <span className="parameter">Status:</span>
                                <span className="value-container">
                                    <span className="value">{weatherData.gps_status ? "Active" : "Inactive"}</span>
                                </span>
                            </li>
                            <li className="list-group-item">
                                <span className="parameter">Longitude:</span>
                                <span className="value-container">
                                    <span className="value">{weatherData.gps_longitude}</span>
                                </span>
                            </li>
                            <li className="list-group-item">
                                <span className="parameter">Latitude:</span>
                                <span className="value-container">
                                    <span className="value">{weatherData.gps_latitude}</span>
                                </span>
                            </li>
                            <li className="list-group-item">
                                <span className="parameter">Altitude:</span>
                                <span className="value-container">
                                    <span className="value">{weatherData.gps_altitude}</span>
                                </span>
                            </li>
                            <li className="list-group-item">
                                <span className="parameter">Timestamp:</span>
                                <span className="value-container">
                                    <span className="value">{new Date(weatherData.timestamp).toLocaleTimeString()}</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};

export default Home;
