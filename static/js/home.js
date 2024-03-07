// Establish the SSE connection
let eventSource = new EventSource('/api/weather_data_sse/');

// Function to handle incoming messages
eventSource.onmessage = function (event) {
    const data = JSON.parse(event.data);

    // Check for errors in the data
    if (data.error) {
        console.error("Error from server:", data.error);
        // display this error to the user
        alert("Error retrieving data from server: " + data.error);
        return;
    }

    // Update DOM elements with new data
    document.getElementById('atm_pressure').textContent = data.atm_pressure || "N/A";
    document.getElementById('humidity').textContent = data.humidity || "N/A";
    document.getElementById('temperature_average').textContent = data.temperature_average || "N/A";
    document.getElementById('temperature_infrared').textContent = data.temperature_infrared || "N/A";
    document.getElementById('illuminance').textContent = data.illuminance || "N/A";
    document.getElementById('wind_dir_numeric').textContent = data.wind_dir_numeric || "N/A";
    document.getElementById('wind_dir_abbr').textContent = data.wind_dir_abbr || "N/A";
    document.getElementById('wind_speed').textContent = data.wind_speed || "N/A";
    document.getElementById('power_supply').textContent = data.power_supply || "N/A";
    document.getElementById('battery_voltage').textContent = data.battery_voltage || "N/A";
    document.getElementById('gps_status').textContent = data.gps_status ? "Active" : "Inactive";
    document.getElementById('gps_longitude').textContent = data.gps_longitude || "N/A";
    document.getElementById('gps_latitude').textContent = data.gps_latitude || "N/A";
    document.getElementById('gps_altitude').textContent = data.gps_altitude || "N/A";
    // Format the timestamp as a time with hours, minutes, and seconds
    document.getElementById('timestamp').textContent = data.timestamp ?
        new Date(data.timestamp).toLocaleTimeString([],
            {hour: '2-digit', minute: '2-digit', second: '2-digit'}) : "N/A";

};

// Handle errors
eventSource.onerror = function (event) {
    console.error("SSE error:", event);
    // Close the current connection
    eventSource.close();
    // Attempt to reconnect after 5 seconds
    setTimeout(function () {
        console.log("Attempting to reconnect...");
        eventSource = new EventSource('/api/weather_data_sse/');
    }, 5000);
};