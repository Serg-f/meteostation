FROM python:3.10-slim
ENV PYTHONUNBUFFERED 1
WORKDIR /project_dir
COPY ./src/requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt
COPY ./src .
