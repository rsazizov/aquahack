from api import db
from api import app

from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)


class User(db.Model):
  __tablename__ = 'user'

  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(32), index = True)
  password_hash = db.Column(db.String(128))

  def hash_password(self, password):
    self.password_hash = pwd_context.encrypt(password)

  def verify_password(self, password):
    return pwd_context.verify(password, self.password_hash)

  def generate_auth_token(self, expiration = 900000):
    s = Serializer(app.config['SECRET_KEY'], expires_in = expiration)
    return s.dumps({ 'id': self.id })

  @staticmethod
  def verify_auth_token(token):
      s = Serializer(app.config['SECRET_KEY'])
      try:
          data = s.loads(token)
      except SignatureExpired:
          return None # valid token, but expired
      except BadSignature:
          return None # invalid token

      user = User.query.get(data['id'])
      return user
  
  def __repr__(self):
    return f'<User name={self.name}>'

class Field(db.Model):
  __tablename__ = 'field'

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(32))
  api_id = db.Column(db.String(24), unique=True)
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
  geo = db.Column(db.JSON)

  def to_dict(self):
    forecast = {}

    for fc in Forecast.query.filter_by(field_id=self.id):
      forecast[str(fc.date)] = fc.eto

    return {
      'id': self.id,
      'apiId': self.api_id,
      'name': self.name,
      'forecast': forecast
    }

  def __repr__(self):
    return f'<Field id={self.id}'

class Forecast(db.Model):
  __tablename__ = 'forecast'

  id = db.Column(db.Integer, primary_key=True)
  field_id = db.Column(db.Integer, db.ForeignKey('field.id'))
  date = db.Column(db.Date, nullable=False)
  eto = db.Column(db.Float, nullable=False)

class Measurement(db.Model):
  __tablename__ = 'measurement'

  def to_dict(self):
    return {
      'id': self.id,
      'date': self.date,
      'ndvi': self.ndvi
    }

  id = db.Column(db.Integer, primary_key=True)
  field_id = db.Column(db.Integer, db.ForeignKey('field.id'))
  date = db.Column(db.Date, nullable=False)
  ndvi = db.Column(db.Float, nullable=False)