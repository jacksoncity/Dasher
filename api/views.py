from flask import Blueprint, jsonify, request
from . import db
from .models import Drive
from sklearn.model_selection import train_test_split
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import Ridge

main = Blueprint('main', __name__)


'''
Just a placeholder that does not matter
'''
@main.route('/')
def home():
    return jsonify(data="Landing page so it's not an error")


'''
Method to add a drive to the drive database.
------REMEMBER------
WHEN PUTTING IN RESTAURATNS, USE INTS!!! (not strings)
'''
@main.route('/add_drive', methods=["POST"])
def add_drive():

    drive_data = request.get_json()

    new_drive = Drive(
        distance=drive_data['distance'], 
        pay=drive_data['pay'], 
        restaurant=drive_data['restaurant'],
        rate=drive_data['rate'])

    db.session.add(new_drive)
    db.session.commit()
    
    return "Done", 201


'''
Method to display all the drives that are in the database as of now
Will show, restaurant, distance, pay and rate
'''
@main.route('/drives')
def drives():

    drive_list = Drive.query.all()
    drives = []

    for drive in drive_list:
        drives.append({
            'restaurant' : drive.restaurant, 
            'distance' : drive.distance, 
            'pay' : drive.pay, 
            'rate' : drive.rate})

    return jsonify({'drives': drives}), 201


'''
Method to remove everything from the database and then let you know how much was deleted.
This is more just for testing purposes so that you can remove everything and start again
'''
@main.route('/remove')
def remove():

    deleted = Drive.query.delete()
    db.session.commit()

    return str(deleted) + " deleted", 201

'''
This method is the actual linear regression that will be happening
This will check to see if the optimization will be accurate or not because of 
how much past data the driver has and will let the driver know and stuff.
Will get the from the database
@param newData: new data that the driver just inputed to get estimation on, should be in the form of
a json request with the attributes distance, pay and restaurant
'''
@main.route('/get_recommendation', methods=["POST"])
def get_recommendation():

    input_data = request.get_json()
    to_save = Drive(
        distance=input_data['distance'], 
        pay=input_data['pay'], 
        restaurant=input_data['restaurant'])
    new_drive = np.zeros(3)
    new_drive[0] = input_data['distance']
    new_drive[1] = input_data['pay']
    new_drive[2] = input_data['restaurant']
    new_drive = np.reshape(new_drive, (1, -1))
    
    drive_list = Drive.query.all()
    pay = np.zeros(len(drive_list))
    restaurant = np.zeros(len(drive_list))
    distance = np.zeros(len(drive_list))
    targets = np.zeros(len(drive_list))
    message = {}

    if(len(drive_list) < 10):
        message['message'] = 'Not enough recorded drives to make a prediction'
        return jsonify({"message": message}), 201
    elif(len(drive_list) < 50):
        message['message'] = 'Prediction may be innacurate'
    else:
        message['message'] = 'None'

    index = 0
    for drive in drive_list:
        pay[index] = drive.pay
        distance[index] = drive.distance
        restaurant[index] = drive.restaurant
        targets[index] = drive.rate
        index += 1

    stats = np.stack((distance, pay, restaurant), axis = -1)

    ridge = Ridge().fit(stats, targets)
    prediction = ridge.predict(new_drive)

    message['prediction'] = prediction[0]

    #db.session.add(to_save)
    #db.session.commit()

    return jsonify({'message': message}), 201




        
    