from api import app, db
from api.models import *

from flask_httpauth import HTTPBasicAuth
from flask import g, request, send_file

from api.utils import *

from pyowm.commons.enums import ImageTypeEnum
from pyowm.agroapi10.enums import SatelliteEnum, PresetEnum

import requests
import io
import datetime as dt
import pyowm as owm
import json
import pyeto

auth = HTTPBasicAuth()

@auth.verify_password
def verify_password(username_or_token, password):
  print(username_or_token)
  # first try to authenticate by token
  user = User.verify_auth_token(username_or_token)
  if not user:
    # try to authenticate with username/password
    user = User.query.filter_by(username = username_or_token).first()
    if not user or not user.verify_password(password):
       return False

  g.user = user
  return True

@app.route('/api/token')
@auth.login_required
def token():
  token = g.user.generate_auth_token()
  return { 'token': token.decode('ascii') }

def create_polygon(lon, lat, name):
  d = 0.001

  first = (lon - d, lat - d)
  poly = [[
    first,
    (lon + d, lat - d),
    (lon + d, lat + d),
    (lon - d, lat + d),
    first
  ]]

  ow = owm.OWM(app.config['OWM_API_KEY'])
  mgr = ow.agro_manager()

  #result = mgr.create_polygon(owm.utils.geo.Polygon(poly), name)

  return poly, str(dt.datetime.now()) #result.id

def calc_eto(field, year_day, fc):
  lon, lat = json.loads(field.geo)[0][0]

  lon = pyeto.convert.deg2rad(lon)
  lat = pyeto.convert.deg2rad(lat)

  tmp = fc.temperature('kelvin')

  alt = float(elevation(lon, lat))

  ea = pyeto.fao.avp_from_tdew(fc.dewpoint)
  es = pyeto.fao.svp_from_t(tmp['day'])

  sol_dec = pyeto.fao.sol_dec(year_day)
  sha = pyeto.fao.sunset_hour_angle(lat, sol_dec)
  ird = pyeto.fao.inv_rel_dist_earth_sun(year_day)
  et_rad = pyeto.fao.et_rad(lat, sol_dec, sha, ird)
  cs_rad = pyeto.fao.cs_rad(alt, et_rad)

  sol_rad = pyeto.fao.sol_rad_from_t(et_rad, cs_rad, tmp['min'], tmp['max'], False)

  net_out_lw_rad = pyeto.fao.net_out_lw_rad(tmp['min'], tmp['max'], sol_rad, cs_rad, ea)
  net_in_sol_rad = pyeto.fao.net_in_sol_rad(sol_rad)

  net_rad = pyeto.fao.net_rad(net_in_sol_rad, net_out_lw_rad)
  psy = pyeto.fao.psy_const(fc.pressure['press'])

  t = (tmp['max'] + tmp['min']) / 2
  delta_svp = pyeto.fao.delta_svp(t)

  eto = pyeto.fao.fao56_penman_monteith(net_rad, t, fc.wind().get('speed', 0),
                                      es, ea, delta_svp, psy)

  return eto

@app.route('/api/forecast')
def forecast():
  ow = owm.OWM(app.config['OWM_API_KEY'])
  mgr = ow.weather_manager()

  field = Field.query.first()

  lon, lat = json.loads(field.geo)[0][0]

  one_call = mgr.one_call(lat=lat, lon=lon)
  year_day = dt.date.today().timetuple().tm_yday
  eto_forecast = []

  for i, fc in enumerate(one_call.forecast_daily[:7]):
    eto = calc_eto(field, year_day + 1, fc)
    f = Forecast(field_id=-1, date=dt.date.today() + dt.timedelta(days=i), water=eto)
    db.session.add(f)
  
  # for field in Field.query.all():
  #   for i, eto in enumerate(eto_forecast):
  #     k = lookup_crop_k(field.crop)
  #     liters = (eto * k * field.area)
  #     f = Forecast(field_id=field.id, date=dt.date.today() + dt.timedelta(days=i), water=liters)
  #     db.session.add(f)
  
  db.session.commit()

  return { 'status': 'ok' }

def fetch_ndvi(id):
  MAX_CLOUD_COVERAGE = 80
  NDVI_PERIOD_DAYS = 365

  ow = owm.OWM(app.config['OWM_API_KEY'])
  mgr = ow.agro_manager()

  now = int(dt.datetime.now().timestamp())

  acq_from = int((dt.datetime.now() - dt.timedelta(days=NDVI_PERIOD_DAYS)).timestamp())
  acq_to = now

  img_type = ImageTypeEnum.PNG
  preset = PresetEnum.NDVI
  sat = SatelliteEnum.SENTINEL_2.symbol

  result = mgr.search_satellite_imagery(id, acq_from, acq_to, 
      img_type=img_type, preset=preset, acquired_by=sat)[0]

  r = requests.get(result.url)

  return r.content
  
@app.route('/api/ndvi/<id>')
def ndvi(id):
  r = fetch_ndvi(id)
  return send_file(io.BytesIO(r), mimetype='image/png')

@app.route('/api/field', methods=['POST', 'GET'])
# @auth.login_required
def field():
  if request.method == 'GET':
    # fields = Field.query.filter_by(user_id=g.user.id)
    fields = Field.query.all()

    return {
      'fields': [field.to_dict() for field in fields]
    }
  else:
    print(request.get_data())
    data = request.get_json() or {}

    lon = data['lon']
    lat = data['lat'] 
    name = data['name'] 
    area = float(data['area'])
    crop = data['crop']

    poly, api_id = create_polygon(lon, lat, name)

    field = Field(name=name, api_id=api_id, 
                  user_id=1, geo=json.dumps(poly),
                  area=area, crop=crop, water_price=lookup_water_price(0, 0))

    db.session.add(field)
    db.session.commit()

    for fc in Forecast.query.filter_by(field_id=-1):
      k = lookup_crop_k(field.crop)
      liters = fc.water * k * area
      f = Forecast(field_id=field.id, date=fc.date, water=liters)
      db.session.add(f)

    db.session.commit()

    return field.to_dict()