# Weather Station App

Welcome to the repository for the Weather Station App, a sophisticated platform designed for the observation, collection, storage, and analysis of data received from various weather sensors. This application processes a wide range of data including atmospheric pressure, temperature, humidity, wind speed and direction, among others. Built using a microservices RESTful API architecture, the app consists of three core services along with a few additional services, ensuring a robust and scalable solution for weather data management.

## Core Services

### Controller Service
The Controller Service simulates responses from micro-controllers connected to different weather sensors. It is built with FastAPI and accounts for data fluctuations over various periods (hour, day, month, year), responding with JSON when requested.

### Main Service
The Main Service, built with Django REST Framework (DRF), is scheduled to request data from the Controller Service every 5 seconds using Celery and Redis, storing it in a PostgreSQL database. It handles data deletion for records older than 90 days and continues processing available data even if some sensors or the controller fail. The service is dockerized alongside Redis, Celery worker, Celery beat, and PostgreSQL for isolated and efficient operation.

### Frontend Service
The Frontend Service, built with React, offers real-time weather data monitoring and interactive graph-based reports for various parameters over selected periods. It establishes a Server-Sent Events (SSE) connection to the Main Service for real-time updates and uses WebSockets for interactive dashboard functionalities.

## Technologies Used

- **Backend**: Django, Django REST Framework, FastAPI, Celery, Redis
- **Frontend**: JavaScript, React, HTML, CSS, Bootstrap
- **Database**: PostgreSQL
- **Data Streaming**: SSE (Server-Sent Events), WebSockets
- **Testing**: Unittest (for DRF services), Pytest (for FastAPI services)
- **CI/CD**: GitHub Actions, Docker, Docker Compose
- **Deployment**: DigitalOcean, Nginx

## Architecture

The application's architecture is designed for scalability and resilience. The microservices approach allows for independent development, deployment, and scaling of each service. The use of Docker and Docker Compose ensures easy deployment and management of services, while GitHub Actions facilitate continuous integration and deployment processes.

## Logging and Monitoring

Logging is implemented across all services using Python's `logging` module, with different log levels to capture and diagnose issues effectively. Monitoring and analysis of logs are crucial for maintaining the operational health of the application.

## Testing

Comprehensive testing is performed using Unittest for the DRF-based Main Service and Pytest for the FastAPI-based Controller Service. Tests are run in separate containers to ensure consistency in the testing environment.

## Data Handling and Analysis

The app efficiently collects, stores, and analyzes weather data, offering insights through real-time updates and interactive dashboards. Data is managed with a focus on performance and scalability, using technologies like Redis for message brokering and PostgreSQL for reliable data storage.

## Live Application

Check out the live application here: [Weather Station](http://139.59.130.45/)

[![CI/CD Pipeline](https://github.com/Serg-f/meteostation/actions/workflows/cicd.yml/badge.svg)](https://github.com/Serg-f/meteostation/actions/workflows/cicd.yml)
