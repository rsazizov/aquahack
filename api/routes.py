from api import app
from flask_httpauth import HTTPBasicAuth
from api.models import User

from flask import g

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

@app.route('/api/field', methods=['POST', 'GET'])
@auth.login_required
def field():
  return 'You are logged in!'