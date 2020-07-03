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
  
  def __repr__():
    return f'<User name={self.name}>'

class Field(db.Model):
  __tablename__ = 'field'

  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
  geo = db.Column(db.JSON)

  def __repr__():
    return f'<Field id={self.id}'