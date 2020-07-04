from api import app, db
from api.models import User, Field

from flask_httpauth import HTTPBasicAuth
from flask import g, request

import pyowm as owm
import json

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
  d = 0.02

  first = (lon - d, lat - d)
  poly = [[
    first,
    (lon + d, lat - d),
    (lon + d, lat + d),
    (lon - d, lat + d),
    first
  ]]

  ow = owm.OWM('03d85b323aa54f824fee5b1d5d17da11')
  mgr = ow.agro_manager()

  result = mgr.create_polygon(owm.utils.geo.Polygon(poly), name)

  return poly, result.id

@app.route('/api/field', methods=['POST', 'GET'])
# @auth.login_required
def field():
  if request.method == 'GET':
    field = Field.query.all()
    return [field.to_dict() for field in fields]
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


    return { 'status': 'ok' }
