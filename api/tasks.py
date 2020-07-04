from api import app, celery, db
from api.models import Field, Measurement

from pyowm.commons.enums import ImageTypeEnum
from pyowm.agroapi10.enums import SatelliteEnum, PresetEnum

import io
import requests
import pyowm as owm
import datetime as dt
import numpy as np
import matplotlib.pyplot as plt

from osgeo import gdal

# In %
MAX_CLOUD_COVERAGE = 80

# Vegetation begins at 0.2
NDVI_THRESHOLD = 0.2

NDVI_PERIOD_DAYS = 365

@celery.task
def fetch_ndvi(field):
  f = open('out.txt', 'w')
  f.write('MEOW!')
  id = field.api_id
  ow = owm.OWM(app.config['OWM_API_KEY'])
  mgr = ow.agro_manager()

  now = int(dt.datetime.now().timestamp())

  acq_from = int((dt.datetime.now() - dt.timedelta(days=NDVI_PERIOD_DAYS)).timestamp())
  acq_to = now

  img_type = ImageTypeEnum.GEOTIFF
  preset = PresetEnum.NDVI
  sat = SatelliteEnum.SENTINEL_2.symbol

  results = mgr.search_satellite_imagery(id, acq_from, acq_to, 
      img_type=img_type, preset=preset, acquired_by=sat)

  for result in results:
    f.writelines(('Processing', str(result)))
    f.flush()
    r = requests.get(result.url)

    with open('/tmp/test', 'wb') as f:
      f.write(r.content)

    img = gdal.Open('/tmp/test')
    arr = img.GetRasterBand(1)
    # img = Image.open(io.BytesIO(r.content))A
    arr = np.array(img)

    # arr = np.linalg.norm(255 - arr, axis=2)
    # arr = arr / arr.max()

    ndvi = arr[arr > NDVI_THRESHOLD].mean()

    measurement = Measurement(field_id=field.id,
                              date=dt.date.fromtimestamp(result.acquisition_time()),
                              ndvi=ndvi)
    db.session.add(measurement)
    db.session.commit()
    
    img.close()
  
  f.write("NO:(")
  f.close()