from flask import Blueprint, jsonify, request
from . import db
from .models import Drive

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return jsonify(data="Landing page so it's not an error")

@main.route('/add_drive', methods=["POST"])
def add_drive():

    drive_data = request.get_json()

    new_drive = Drive(distance=drive_data['distance'], pay=drive_data['pay'], restaurant=drive_data['restaurant'])

    db.session.add(new_drive)
    db.session.commit()
    
    return "Done", 201

@main.route('/drives')
def drives():

    drive_list = Drive.query.all()
    drives = []

    for drive in drive_list:
        drives.append({'restaurant' : drive.restaurant, 'distance' : drive.distance, 'pay' : drive.pay})

    return jsonify({'drives': drives}), 201

@main.route('/remove')
def remove():

    deleted = Drive.query.delete()
    db.session.commit()

    return str(deleted) + " deleted", 201