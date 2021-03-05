from . import db
from datetime import datetime

class Drive(db.Model):
    id = db.Column(db.Integer, primary_key=True) #synonymous with drive
    trip = db.Column(db.Integer)
    start = db.Column(db.DateTime)
    restaurant_arrival = db.Column(db.DateTime)
    restaurant_leave = db.Column(db.DateTime)
    end = db.Column(db.DateTime)
    restaurant = db.Column(db.String(75))
    pay = db.Column(db.Float)
    delivery_time = db.Column(db.Float)
    restaurant_time = db.Column(db.Float)
    distance = db.Column(db.Float)