import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'meteostation.settings')

app = Celery('meteostation')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'process_controller_data': {
        'task': 'meteo_app.tasks.fetch_and_save_controller_data',
        'schedule': crontab(minute='*/1'),  # every minute at 0 seconds
    },
    'delete_old_controller_data': {
        'task': 'meteo_app.tasks.delete_old_controller_data',
        'schedule': crontab(hour='0', minute='0'),  # every day at midnight
    },
}
