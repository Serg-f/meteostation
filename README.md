# Weather Station App

Welcome to the Weather Station App repository, a sophisticated platform designed for the observation, collection, storage, and analysis of data received from various weather sensors. This application processes diverse meteorological parameters including atmospheric pressure, temperature, humidity, wind speed and direction, among others, employing a microservices architecture with RESTful API design. It consists of three core services alongside several auxiliary services, providing a robust solution for real-time weather data monitoring and analysis.

## Key Features

- **Microservices Architecture**: Built using a microservices RESTful API architecture to ensure scalability and flexibility of the application.
- **Real-Time Data Processing**: Utilizes FastAPI and Django REST Framework (DRF) to handle real-time data processing from various weather sensors.
- **Dynamic Data Storage**: Employs PostgreSQL for robust data storage, with automatic deletion of data older than 90 days using Celery scheduled tasks.
- **Fault Tolerance**: Designed to continue processing available data smoothly, even in the event of sensor or controller failures.
- **Real-Time Monitoring and Interactive Reporting**: Features a React-based frontend for real-time weather data monitoring and interactive graph-based reporting on different parameters over selectable time periods.
- **Comprehensive Testing and Logging**: Implements extensive testing with unittest for DRF services and pytest for FastAPI services, alongside detailed logging using Python's `logging` module.

## Technologies Used

### Backend
- **FastAPI** for the Controller Service, simulating micro-controller responses.
- **Django REST Framework** for the Main Service, orchestrating data collection, processing, and storage.
- **Celery with Redis** for scheduling data fetches every 5 seconds and for deleting old data.
- **PostgreSQL** for durable and efficient data storage.

### Frontend
- **React** for building a dynamic and responsive user interface.
- **JavaScript, HTML, CSS** for frontend scripting and styling.
- **Bootstrap** for responsive design ensuring a seamless user experience across devices.

### DevOps
- **Docker and Docker Compose** for containerization and orchestration of microservices.
- **GitHub Actions** for CI/CD, automating the testing and deployment pipeline.
- **Digital Ocean, Nginx** for hosting and reverse proxy services.

## Application Workflow

1. **Data Collection**: The Controller Service, built with FastAPI, simulates responses from weather sensors, offering data on various meteorological parameters.
2. **Data Processing and Storage**: The Main Service, implemented with Django REST Framework, is scheduled to fetch data from the Controller Service every 5 seconds, storing it in a PostgreSQL database.
3. **Real-Time Monitoring and Analysis**: The Frontend Service, created with React, provides real-time monitoring and interactive analysis features, allowing users to visualize weather data over different time periods through interactive graphs.
4. **Fault Tolerance and Reliability**: The system is designed to handle failures gracefully, ensuring continuous operation and data processing even in the event of sensor or controller downtime.

## Live Application

Check out the live application here: [Weather Station](http://139.59.130.45/)

[![CI/CD Pipeline](https://github.com/Serg-f/meteostation/actions/workflows/cicd.yml/badge.svg)](https://github.com/Serg-f/meteostation/actions/workflows/cicd.yml)
