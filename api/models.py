from . import db
from datetime import datetime

class Drive(db.Model):
    id = db.Column(db.Integer, primary_key=True) #synonymous with drive
    trip = db.Column(db.Integer)
    start = db.Column(db.DateTime)
    restaurant_arrival = db.Column(db.DateTime)
    restaurant_leave = db.Column(db.DateTime)
    end = db.Column(db.DateTime)
    restaurant = db.Column(db.Float) #needs to go in as a float but IDK how were gonna do that yet
    pay = db.Column(db.Float)
    delivery_time = db.Column(db.Float)
    restaurant_time = db.Column(db.Float)
    distance = db.Column(db.Float)
    rate = db.Column(db.Float)