import React, {useState, useEffect, useRef} from "react";
import BaseLayout from "./BaseLayout";
import {Chart, registerables} from 'chart.js';
import 'chartjs-adapter-date-fns';
import '../css/dashboard.css';

// Register Chart.js components
Chart.register(...registerables);

const Dashboard = () => {
    // Calculate yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Calculate today's date
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

    const parameters = [
        {value: 'atm_pressure', label: 'Atmospheric Pressure'},
        {value: 'humidity', label: 'Humidity'},
        {value: 'temperature_average', label: 'Temperature (Average)'},
        {value: 'temperature_infrared', label: 'Temperature (Infrared)'},
        {value: 'illuminance', label: 'Illuminance'},
        {value: 'wind_speed', label: 'Wind Speed'},
    ];

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/ws/dashboard/');
        ws.current.onopen = () => {
            requestData();
        };
        ws.current.onmessage = (event) => {
            const {data} = JSON.parse(event.data);

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const calculateTimeDiffInDays = (startDateString, endDateString) => {
                const startDate = new Date(startDateString);
                const endDate = new Date(endDateString);
                return (endDate - startDate) / (1000 * 60 * 60 * 24); // Difference in days
            };

            const timeDiffInDays = calculateTimeDiffInDays(startDatetime, endDatetime);
            let timeUnit = 'day';

            if (timeDiffInDays < 1) {
                timeUnit = 'hour';
            } else if (timeDiffInDays <= 7) {
                timeUnit = 'day';
            } else if (timeDiffInDays <= 30) {
                timeUnit = 'week';
            } else {
                timeUnit = 'month';
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstanceRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(d => d.timestamp),
                    datasets: [{
                        label: parameters.find(p => p.value === parameter).label,
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
                                unit: timeUnit
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
                                text: 'Value'
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

        };

        const requestData = () => {
            if (ws.current) {
                ws.current.send(JSON.stringify({
                    parameter: parameter,
                    start: startDatetime,
                    end: endDatetime
                }));
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [parameter, startDatetime, endDatetime]);

    return (
        <BaseLayout>
            <div className="dashboard-container"> {/* Apply card styles for consistency */}
                <div>
                    <label htmlFor="parameter-select">Select Parameter:</label>
                    <select id="parameter-select" value={parameter}
                            onChange={(e) => setParameter(e.target.value)}>
                        {parameters.map(param => (
                            <option key={param.value} value={param.value}>{param.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="start-datetime">Start Date and Time:</label>
                    <input type="datetime-local" id="start-datetime" value={startDatetime}
                           onChange={(e) => setStartDatetime(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="end-datetime">End Date and Time:</label>
                    <input type="datetime-local" id="end-datetime" value={endDatetime}
                           onChange={(e) => setEndDatetime(e.target.value)}/>
                </div>
                <div style={{height: '400px', marginTop: '20px'}}>
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>
        </BaseLayout>
    );
};

export default Dashboard;
