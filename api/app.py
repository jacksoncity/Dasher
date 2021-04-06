from flask import jsonify, request, Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, ForeignKey
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
class Restaurant(db.Model):
    restaurant_name = db.Column(db.String(50), primary_key=True, nullable=False)
    average_wait = db.Column(db.Float, nullable=False)

class User(db.Model):
    username = db.Column(db.String(20), primary_key=True, nullable=False) #username cant go over 20 char
    email = db.Column(db.String(50), nullable=False) #email cant go over 50 char
    password = db.Column(db.String(40), nullable=False) #password cant go over 40 char

class Drive(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False) #synonymous with drive
    start = db.Column(db.DateTime)
    restaurant_arrival = db.Column(db.DateTime)
    restaurant_leave = db.Column(db.DateTime)
    end = db.Column(db.DateTime)
    pay = db.Column(db.Float, nullable=False)
    restaurant_time = db.Column(db.Float)
    distance = db.Column(db.Float, nullable=False)
    rate = db.Column(db.Float)
    restaurant_name = db.Column(db.Integer, ForeignKey("restaurant.restaurant_name"), nullable=False)
    username = db.Column(db.Integer, ForeignKey("user.username"), nullable=False)


class Comment(db.Model):
    comment_id = db.Column(db.Integer, primary_key=True, nullable=False)
    comment = db.Column(db.String(400), nullable=False)
    restaurant_name = db.Column(db.Integer, ForeignKey("restaurant.restaurant_name"), nullable=False)
    username = db.Column(db.String(20), ForeignKey("user.username"), nullable=False)


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
@param newData: TYPE - json request, ATTRIBUTES - 'distance', 'pay', 'restaurant', 'username'
'''
@app.route('/add_drive', methods=["POST"])
def add_drive():

    input_data = request.get_json()
    restaurant = Restaurant.query.filter_by(restaurant_name=input_data['restaurant']).first()

    if (restaurant == None):
        restaurant = Restaurant(
            restaurant_name=input_data['restaurant'],
            average_wait=5)
        db.session.add(restaurant)
        db.session.commit()
    
    new_drive = Drive(
        distance=input_data['distance'], 
        pay=input_data['pay'], 
        restaurant_name=restaurant.restaurant_name,
        username=input_data['username'])

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
            'rate' : drive.rate,
            'user' : drive.username})

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

    #Find restaruant in reference
    restaurant = Restaurant.query.filter_by(restaurant_name=input_data['restaurant']).first()

    #If this restaurant has not been visited before
    if restaurant == None:
        restaurant = Restaurant(
            restaurant_name=input_data['restaurant'],
            average_wait=5)
        db.session.add(restaurant)
        db.session.commit()
    
    #Create new drive with corresponding drive
    to_save = Drive(
        distance=input_data['distance'], 
        pay=input_data['pay'], 
        restaurant_name=restaurant.restaurant_name,
        username=current_user.username)

    #Create numpy version of this new drive to feed the algorithm
    new_drive = np.zeros(3)
    new_drive[0] = to_save.distance
    new_drive[1] = to_save.pay
    new_drive[2] = restaurant.average_wait #using the restaurants average wait to do this
    new_drive = np.reshape(new_drive, (1, -1))
    
    #Creating numpy arrays to go into algo
    drive_list = db.session.query(Drive).filter_by(username=current_user.username).all()
    drive_len = len(drive_list)
    pay_stack = np.zeros(drive_len)
    restaurant_stack = np.zeros(drive_len)
    distance_stack = np.zeros(drive_len)
    targets = np.zeros(drive_len)
    message = {}

    #Creating messages based on how many drives the user has made
    if(drive_len < 10):
        message['message'] = 'Not enough recorded drives to make a prediction'
        return jsonify({"message": message}), 201
    elif(drive_len < 50):
        message['message'] = 'Prediction may be innacurate'
    else:
        message['message'] = 'None'

    #Putting all of the drives in the database in numpy arrays so that it can go in the algo
    index = 0
    for drive in drive_list:
        related_restaurant = Restaurant.query.filter_by(restaurant_name=drive.restaurant_name).first()
        pay_stack[index] = drive.pay
        distance_stack[index] = drive.distance
        restaurant_stack[index] = related_restaurant.average_wait
        targets[index] = drive.rate
        index += 1

    #committing the drive here so it doesn't interfere with previous loop
    db.session.add(to_save)
    db.session.commit()

    #Stacking and formatting to put in algo
    stats = np.stack((distance_stack, pay_stack, restaurant_stack), axis = -1)

    #Putting in algo
    ridge = Ridge().fit(stats, targets)
    prediction = ridge.predict(new_drive)
    prediction[0] = round(prediction[0], 2)

    #Adding the prediction to the message
    message['prediction'] = prediction[0]

    return jsonify({'message': message}), 201

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

    #Putting in the new times for the drive that is inputed
    drive = Drive.query.filter_by(id=func.max(Drive.id))
    drive.start = input_data['start']
    drive.restaurant_arrival = input_data['restaurant_arrival']
    drive.restaurant_leave = input_data['restaurant_leave']
    drive.end = input_data['end']
    drive.rate = (drive.end - drive.start) / drive.pay
    drive.restaurant_time = drive.restaurant_leave - drive.restaurant_arrive

    #Getting all previous drives to this restaurant to get a new average
    previous_restaurant_visits = Drive.query.filter_by(restaurant_name=drive.restaurant_name).all()

    #Adding all of the restaurant times and dividing it by total trips
    rate = 0
    if previous_restaurant_visits is not None:
        for visit in previous_restaurant_visits:
            rate = rate + visit.restaurant_time
        rate = rate / len(previous_restaurant_visits)
    else:
        rate = drive.restaurant_time

    #Updating the restaurant 
    related_restaurant = Restaurant.query.filter_by(restaurant_name=drive.restaurant_name).first()
    related_restaurant.rate = rate

    #I don't know if you have to commit when updating but might as well
    db.session.commit()


    return "done"

'''
This method is for when the user does not like the recommendation that they get in the get 
recommendation screen and they choose to reject the drive
'''
@app.route('/decline_drive', methods['GET'])
def decline_drive():

    #Get the most recent drive and delete
    drive = Drive.query.filter_by(id=func.max(Drive.id)).delete()
    db.session.commit()

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
        return jsonify({'message': 'login successful'}), 201
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
    '''
    I'm getting rid of trip from the database. It stood for the shift that they were working, not the
    individual delivery that they were doing, I think that you were looking for the specific deliveries
    so I just changed it to the len of stat_list because thats how many deliveries they would have done
    '''
    def get_trips():
        '''
        for stat in stat_list:
            overallTrips = overallTrips + Drive.trip

        return overallTrips
        '''
        return len(stat_list)
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

def temp():

    print(User.query.all())
    

if __name__ == "__main__":
    temp()



        
    