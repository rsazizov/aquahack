from api import app, db
from api.models import *
from api.tasks import fetch_ndvi

from flask_httpauth import HTTPBasicAuth
from flask import g, request

from api.utils import elevation

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
  d = 0.005

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

  result = mgr.create_polygon(owm.utils.geo.Polygon(poly), name)

  return poly, result.id

@app.route('/api/ndvi')
def ndvi():
  data = request.get_json()

  field = Field.query.filter_by(apiId=data['field']['apiId']).first()
  msms = Measurement.query.filter_by(field_id=field.id).all()

  return {
    "field": field.id,
    "measurements": [msm.to_dict() for msm in msms]
  }

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
    eto_forecast.append(calc_eto(field, year_day + 1, fc))

  for field in Field.query.all():
    for i, eto in enumerate(eto_forecast):
      f = Forecast(field_id=field.id, date=dt.date.today() + dt.timedelta(days=i), eto=eto)
      db.session.add(f)
  
  db.session.commit()

  return { 'status': 'ok' }

@app.route('/api/field', methods=['POST', 'GET'])
# @auth.login_required
def field():
  if request.method == 'GET':
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

    poly, api_id = create_polygon(lon, lat, name)

    field = Field(name=name, api_id=api_id, user_id=0, geo=json.dumps(poly))

    db.session.add(field)
    db.session.commit()

    forecast(field)

    return {
      'name': name,
      'apiId': api_id
    }