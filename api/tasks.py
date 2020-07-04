from api import celery
from models import Field

@celery.task
def fetch_ndvi(field):
  pass