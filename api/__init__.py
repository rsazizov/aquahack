from flask import Flask
from api.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from celery import Celery

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
celery = Celery(app.name)

from api import routes
from api import models
from api import tasks