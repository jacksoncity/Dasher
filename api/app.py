from flask import jsonify, request, Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from sklearn.model_selection import train_test_split
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import Ridge
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
db.app = app
app.config['CORS_HEADERS'] = "Content-Type"
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# models for this databasee
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
    #restaurant_id = db.Column(db.Integer)
    #user_id = db.Column(db.Integer)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique = True) #username cant go over 20 char
    email = db.Column(db.String(50), unique = True) #email cant go over 50 char
    password = db.Column(db.String(40)) #password cant go over 40 char

'''
class Comment(db.Model):
    comment_id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String(500))
    restaurant_id = db.Column(db.Integer, foreign_key=True)
    user_id = db.Column(db.Integer, foreign_key=True)
'''

'''
class Restaurant(db.Model):
    restaurant_id = db.Column(db.Integer, primary_key=True)
    average_wait = db.Column(db.Float)
'''

'''
Can add things up here that are like global variables for all of the views
However, it will go away whenever the server restarts, not to be used as a database
'''
current_user = None

'''
Just a placeholder that does not matter
'''
@app.route('/')
def home():
    return jsonify(data="Landing page so it's not an error")


'''
Method to add a drive to the drive database.
------REMEMBER------
WHEN PUTTING IN RESTAURATNS, USE INTS!!! (not strings)
'''
@app.route('/add_drive', methods=["POST"])
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
@app.route('/drives')
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
@app.route('/remove')
def remove():

    deleted = Drive.query.delete()
    db.session.commit()

    return str(deleted) + " deleted", 201

'''
This method is the actual linear regression that will be happening
This will check to see if the optimization will be accurate or not because of 
how much past data the driver has and will let the driver know and stuff.
Will get the from the database
@param newData: TYPE - json request, ATTRIBUTES - 'distance', 'pay', 'restaurant'
@return message: TYPE - json, ATTRIBUTES - 'prediction', 'message'
message: 
    'Not enough recorded drives to make a prediction' - when there is less than 10 drives in database, 
    no prediction will be returned
    'Prediction may be innacurate' - when there is at least 10 drives but less than 50 in the database,
    inaccurate prediction will be returned
    'None' - when at least 50 drives are in the database, accurate prediction will be returned
'''
@app.route('/get_recommendation', methods=["POST"])
@cross_origin()
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
    prediction[0] = round(prediction[0], 2)

    message['prediction'] = prediction[0]

    #db.session.add(to_save)
    #db.session.commit()

    return jsonify({'message': message}), 201


'''
This method allows the user to login and access the app page of the app should the 
credentials of the login be valid, otherwise it fails the login and they are returned 
to a blank login page again.
'''
@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    
    input_data = request.get_json()

    user = User.query.filter_by(username=input_data['username']).first()
    if user == None:
        return jsonify({'message': 'user not found'})
    # need to check the string of password and username
    if check_password_hash(user.password, input_data['password']):
        current_user = user
        # login_user(current_user)
        return jsonify({'message': 'login successfull'}), 201
    return jsonify({'message': 'login failed'}), 404

'''
This method is the general purpose signup that allows the user to be able to login to the app
should the input credentials be valid
@param user_input: TYPE - json ATTRIBUTES - 'username', 'email', 'password'
@return message: TYPE - json ATTRIBUTES - 'message'
message:
    'user created' - if it was a successful signup
'''
@app.route('/signup', methods=['POST'])
@cross_origin()
def signup():
    input_data = request.get_json()

    new_user = User(username=input_data['username'], email=input_data['email'], password=generate_password_hash(input_data['password']))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'user created'}), 201 #then needs to return the user to the login page

    #return jsonify({'message': 'user creation error'}) #needs to return the user to the login page

'''
Method to display all the users that are in the database as of now
Will show, username, password, and email
'''
@app.route('/users')
def users():

    user_list = User.query.all()
    users = []

    for user in user_list:
        users.append({
            'username' : user.username, 
            'password' : user.password,
            'email' : user.email})

    return jsonify({'users': users}), 201
'''
Method to actually store the times from the drive passed by the user through the 'Record Drive' function
@param user_input: TYPE - json ATTRIBUTES - 'start_time', 'restaurant_arrival', 'restaurant_leave', 'end'
@return there will be no return, might change later to something letting the user know 
if it was recorded or not
'''
@app.route('/record_drive', methods=['POST'])
@cross_origin()
def record_drive():

    input_data = request.get_json()

    drive = Drive.query.filter_by(id=func.max(Drive.id))
    drive.start = input_data['start']
    drive.restaurant_arrival = input_data['restaurant_arrival']
    drive.restaurant_leave = input_data['restaurant_leave']
    drive.end = input_data['end']
    db.session.commit()


    return "complete"

'''
Method to show to the user to see informative stats about past drives so they can possibly optimise their future drives more
Will show Overall Pay, Overall Distance Driven, Overall Trips Fulfilled, Average Delivery Time, and Average Rate 
'''
@app.route('/get_statistics')
def get_stats():
    stat_list = Drive.query.all()
    statistics = []

    def get_pay():
        for stat in stat_list:
            overallPay = overallPay + Drive.pay

        return overallPay
    def get_distance():
         for stat in stat_list:
            overallDis = overallDis + Drive.distance

         return overallDis
    def get_trips():
        for stat in stat_list:
            overallTrips = overallTrips + Drive.trip

        return overallTrips
    def get_delivTime():
        for stat in stat_list:
            overallDelivTime = overallDelivTime + Drive.end - Drive.start

        trips = get_trips
        avgDelivTime = overallDelivTime/trips
        return avgDelivTime
    def get_rate():
        for stat in stat_list:
            overallRate = overallRate + Drive.rate
        trips = get_trips
        avgRate = overallRate/trips
        return avgRate

    for stat in stat_list:
        statistics.append({
            'Money Earned' : get_pay,
            'Distance Driven' : get_distance,
            'Trips ran' : get_trips,
            'Average Delivery Time' : get_delivTime,
            'Average Rate' : get_rate
        })

    return jsonify({'statistics' : statistics}), 201

'''
Method to logout of the account
something about having to set up a login_manager for this to work I'm not sure, we'll figure it out later
'''
'''@app.route('/logout')
@login_required
def logout():
    logout_user(current_user)
    return jsonify({'message': 'logout successful'})'''




        
    