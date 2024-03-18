import React, {useState, useEffect, useRef, useCallback} from "react";
import BaseLayout from "./BaseLayout";
import {Chart, registerables} from 'chart.js';
import 'chartjs-adapter-date-fns';
import '../css/dashboard.css';

// Register Chart.js components
Chart.register(...registerables);

const Dashboard = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const today = new Date();

        // Format dates to YYYY-MM-DDTHH:MM as required for datetime-local input value
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = (`0${date.getMonth() + 1}`).slice(-2); // JS months are 0-indexed
            const day = (`0${date.getDate()}`).slice(-2);
            const hours = (`0${date.getHours()}`).slice(-2);
            const minutes = (`0${date.getMinutes()}`).slice(-2);
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };
        const [parameter, setParameter] = useState('temperature_average');
        const [startDatetime, setStartDatetime] = useState(formatDate(yesterday));
        const [endDatetime, setEndDatetime] = useState(formatDate(today));
        const chartRef = useRef(null);
        const ws = useRef(null);
        const chartInstanceRef = useRef(null);
        const previousParameter = useRef(parameter);
        const isParameterChanged = useRef(false);

        const parameters = [
            {value: 'atm_pressure', label: 'Atmospheric Pressure', unit: 'mmHg'},
            {value: 'humidity', label: 'Humidity', unit: '%'},
            {value: 'temperature_average', label: 'Temperature (Average)', unit: '°C'},
            {value: 'temperature_infrared', label: 'Temperature (Infrared)', unit: '°C'},
            {value: 'illuminance', label: 'Illuminance', unit: 'lux'},
            {value: 'wind_dir_numeric', label: 'Wind Direction', unit: '°'},
            {value: 'wind_speed', label: 'Wind Speed', unit: 'm/s'},
            {value: 'power_supply', label: 'Power Supply', unit: 'V'},
            {value: 'battery_voltage', label: 'Battery Voltage', unit: 'V'},
            {value: 'gps_status', label: 'GPS Status', unit: ''},
            {value: 'gps_longitude', label: 'GPS Longitude', unit: '°'},
            {value: 'gps_latitude', label: 'GPS Latitude', unit: '°'},
            {value: 'gps_altitude', label: 'GPS Altitude', unit: 'm'},
        ];

        const requestData = useCallback(() => {
            if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({parameter, start: startDatetime, end: endDatetime}));
            } else {
                console.error('WebSocket is not open. Cannot send data.');
            }
        }, [startDatetime, endDatetime, parameter]); // Include all dependencies here

        // Now you can use requestData in useEffect or other useCallback hooks
        const debounceTimerRef = useRef();

        // Debounce function for data fetching
        // Debounce function for data fetching
        const debounceFetchData = useCallback(() => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            debounceTimerRef.current = setTimeout(() => {
                requestData();
            }, 500); // Debounce timeout
        }, [requestData]);

        const handleDrag = (type) => (event) => {
            event.preventDefault();
            let originalX = event.clientX;
            const originalDate = type === 'start' ? new Date(startDatetime) : new Date(endDatetime);
            let lastFetchX = event.clientX; // Track the last X position that triggered a fetch

            const moveHandler = (moveEvent) => {
                const dx = moveEvent.clientX - originalX;
                const fetchDx = moveEvent.clientX - lastFetchX;
                const timeAdjustment = Math.round(dx / 5) * 60 * 60 * 1000;

                const newDate = new Date(originalDate.getTime() + timeAdjustment);
                const newDatetime = formatDate(newDate);

                if (type === 'start') {
                    setStartDatetime(newDatetime);
                } else {
                    setEndDatetime(newDatetime);
                }

                if (Math.abs(fetchDx) > 20) { // Check if drag distance since last fetch exceeds 20px
                    debounceFetchData(); // Trigger data fetching
                    lastFetchX = moveEvent.clientX; // Reset last fetch position
                }
            };

            const upHandler = () => {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
                if (Math.abs(event.clientX - lastFetchX) <= 10) {
                    // If the user releases the mouse without further dragging,
                    // or moves the pointer back to the initial position, force a data fetch
                    requestData();
                }
            };

            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
        };


        useEffect(() => {
            const initializeWebSocket = () => {
                ws.current = new WebSocket('ws://localhost:8000/ws/dashboard/');
                ws.current.onopen = () => {
                    console.log('WebSocket Connected');
                    requestData();
                };

                ws.current.onmessage = handleWebSocketMessage;

                ws.current.onerror = (error) => {
                    console.error('WebSocket Error:', error);
                };

                ws.current.onclose = () => {
                    console.log('WebSocket Disconnected');
                };
            };

            initializeWebSocket();

            return () => ws.current?.close();
        }, []);


        const handleWebSocketMessage = (event) => {
            const {data} = JSON.parse(event.data);
            updateChart(data, isParameterChanged.current);
            isParameterChanged.current = false; // Reset after handling
        };

        useEffect(() => {
            isParameterChanged.current = previousParameter.current !== parameter;
            requestData();
            previousParameter.current = parameter; // Update after sending request
        }, [parameter, startDatetime, endDatetime]);

        const updateChart = (data, parameterChanged) => {
            const parameterSelectElement = document.getElementById('parameter-select');
            const currentParameterValue = parameterSelectElement.value;
            const selectedParameter = parameters.find(p => p.value === currentParameterValue);
            const yAxisTitle = `${selectedParameter.label} (${selectedParameter.unit})`; // Compose Y-axis title with unit

            if (chartInstanceRef.current && !parameterChanged) {
                const chart = chartInstanceRef.current;
                chart.data.labels = data.map(d => d.timestamp);
                chart.data.datasets.forEach((dataset) => {
                    dataset.data = data.map(d => d.value);
                    dataset.label = yAxisTitle; // Use composed Y-axis title
                });
                chart.options.scales.y.title.text = yAxisTitle; // Update Y-axis title dynamically
                chart.update();
            } else {
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }
                const ctx = chartRef.current.getContext('2d');
                chartInstanceRef.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.map(d => d.timestamp),
                        datasets: [{
                            label: yAxisTitle, // Use composed Y-axis title
                            data: data.map(d => d.value),
                            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjusted background color
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    tooltipFormat: 'dd MMM yyyy HH:mm',
                                    unit: 'day'
                                },
                                title: {
                                    display: true,
                                    text: 'Date and Time'
                                },
                                ticks: {
                                    color: '#FFF' // Improved visibility for ticks
                                },
                                grid: {
                                    color: 'rgba(255,255,255,0.3)' // Lighter grid lines
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: yAxisTitle // Dynamically set Y-axis title
                                },
                                ticks: {
                                    color: '#FFF' // Improved visibility for ticks
                                },
                                grid: {
                                    color: 'rgba(255,255,255,0.3)' // Lighter grid lines
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: 'white' // Ensure text is visible on the darker background
                                }
                            }
                        },
                        maintainAspectRatio: false,
                        elements: {
                            line: {
                                borderWidth: 3
                            },
                            point: {
                                radius: 4 // Make points more visible
                            }
                        },
                        layout: {
                            padding: {
                                top: 10,
                                left: 15,
                                right: 15,
                                bottom: 10
                            }
                        }
                    }
                });
            }
        };


        return (
            <BaseLayout>
                <div className="dashboard-container">
                    <div className="parameter-selection">
                        <label htmlFor="parameter-select">Select Parameter:</label>
                        <select id="parameter-select" value={parameter} onChange={(e) => setParameter(e.target.value)}>
                            {parameters.map(param => (
                                <option key={param.value} value={param.value}>{param.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="datetime-selection">
                        <label htmlFor="start-datetime">Start Date and Time:</label>
                        <input type="datetime-local" id="start-datetime" value={startDatetime}
                               onChange={(e) => setStartDatetime(e.target.value)}/>
                    </div>
                    <div className="datetime-selection">
                        <label htmlFor="end-datetime">End Date and Time:</label>
                        <input type="datetime-local" id="end-datetime" value={endDatetime}
                               onChange={(e) => setEndDatetime(e.target.value)}/>
                    </div>
                    <div className="chart-and-draggers">
                        <div className="dragger-container" onMouseDown={handleDrag('start')}>
                            <div className="dragger start-dragger"></div>
                            <div className="dragger-icon">↔</div>
                        </div>
                        <div className="chart-container">
                            <canvas ref={chartRef}></canvas>
                        </div>
                        <div className="dragger-container" onMouseDown={handleDrag('end')}>
                            <div className="dragger end-dragger"></div>
                            <div className="dragger-icon">↔</div>
                        </div>
                    </div>
                </div>
            </BaseLayout>
        );
    }
;

export default Dashboard;
