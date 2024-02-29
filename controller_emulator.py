from http.server import BaseHTTPRequestHandler, HTTPServer
import json

initial_data = (
    ('atm_pressure', 754.5),
    ('humidity', 48.25),
    ('temperature_average', 19.1),
    ('temperature_infrared', 17.47),
    ('illuminance', 5.0),
    ('wind_dir_numeric', 730),
    ('wind_speed', 0.3),
    ('power_supply', 5.08),
    ('battery_voltage', 0.02),
    ('gps_status', False),
    # ('gps_longitude', None),
    # ('gps_latitude', None),
    # ('gps_altitude', None)
)

counter = 0


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        global counter
        counter = counter + 1 if counter < 5 else 0

        controller_data = dict(initial_data)
        for k, v in controller_data.items():
            if type(v) in [float, int]:
                controller_data[k] += counter

        # Send response status code
        self.send_response(200)

        # Send headers
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        # Write JSON response with the current counter value
        response = json.dumps(controller_data)
        self.wfile.write(response.encode('utf-8'))


if __name__ == '__main__':
    port = 8001
    print(f"Server running on port {port}...")
    httpd = HTTPServer(('localhost', port), SimpleHTTPRequestHandler)
    httpd.serve_forever()
