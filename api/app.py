from flask import jsonify, request, Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, ForeignKey
from sklearn.model_selection import train_test_split
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import Ridge
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS, cross_origin
import pandas as pd
from datetime import datetime

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
    current_user = db.Column(db.Boolean, nullable=False)

class Drive(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False) #synonymous with drive
    start = db.Column(db.DateTime)
    restaurant_arrival = db.Column(db.DateTime)
    restaurant_leave = db.Column(db.DateTime)
    end = db.Column(db.DateTime)
    pay = db.Column(db.Float, nullable=False)
    restaurant_time = db.Column(db.Float) #In minutes
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
    current_user = User.query.filter_by(current_user=True).all()
    assert len(current_user) == 1, len(current_user)
    current_user = current_user[0]
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
        db.session.add(to_save)
        db.session.commit()
        print(current_user)
        print(to_save)
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
@param user_input: TYPE - json ATTRIBUTES - 'start', 'restaurant_arrival', 'restaurant_leave', 'end'
@return there will be no return, might change later to something letting the user know 
if it was recorded or not
'''
@app.route('/record_drive', methods=['POST'])
@cross_origin()
def record_drive():

    input_data = request.get_json()

    months = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
                'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12}
    
    #Converting the inputs to datetimes
    temp = input_data['start'].replace(':', ' ').split()
    start = datetime(int(temp[3]),int(months[temp[1]]),int(temp[2]),int(temp[4]),int(temp[5]),int(temp[6]))
    temp = input_data['restaurant_arrival'].replace(':', ' ').split()
    restaurant_arrival = datetime(int(temp[3]),int(months[temp[1]]),int(temp[2]),int(temp[4]),int(temp[5]),int(temp[6]))
    temp = input_data['restaurant_leave'].replace(':', ' ').split()
    restaurant_leave = datetime(int(temp[3]),int(months[temp[1]]),int(temp[2]),int(temp[4]),int(temp[5]),int(temp[6]))
    temp = input_data['end'].replace(':', ' ').split()
    end = datetime(int(temp[3]),int(months[temp[1]]),int(temp[2]),int(temp[4]),int(temp[5]),int(temp[6]))
    restaurant_time = (restaurant_leave - restaurant_arrival).total_seconds() / 60

    #Putting in the new times for the drive that is inputed
    drive = Drive.query.order_by(Drive.id.desc()).first()
    drive.start = start
    drive.restaurant_arrival = restaurant_arrival
    drive.restaurant_leave = restaurant_leave
    drive.end = end
    drive.rate = (drive.pay * 60) / ((drive.end - drive.start).total_seconds() / 60)
    drive.restaurant_time = restaurant_time

    #Getting all previous drives to this restaurant to get a new average
    previous_restaurant_visits = Drive.query.filter_by(restaurant_name=drive.restaurant_name).all()

    #Adding all of the restaurant times and dividing it by total trips
    wait = 0
    if previous_restaurant_visits is not None:
        for visit in previous_restaurant_visits:
            wait = wait + visit.restaurant_time
        wait = wait / len(previous_restaurant_visits)
    else:
        wait = drive.restaurant_time
    print(wait)

    #Updating the restaurant 
    related_restaurant = Restaurant.query.filter_by(restaurant_name=drive.restaurant_name).first()
    related_restaurant.average_wait = wait

    #Commit all the new changes we have made
    db.session.commit()


    return "done"

'''
This method is for when the user does not like the recommendation that they get in the get 
recommendation screen and they choose to reject the drive
'''
@app.route('/reject_drive')
def reject_drive():

    #Get the most recent drive and delete
    to_delete = Drive.query.order_by(Drive.id.desc()).first()
    db.session.delete(to_delete)
    db.session.commit()
    return "done"

'''
This method allows the user to login and access the app page of the app should the 
credentials of the login be valid, otherwise it fails the login and they are returned 
to a blank login page again.
'''
@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    
    input_data = request.get_json()

    #Getting all currently logged in users, in this device
    current_users = User.query.filter_by(current_user=True).all()

    #Logging them out
    for user in current_users:
        user.current_user=False
        db.session.commit()


    user = User.query.filter_by(username=input_data['username']).first()
    if user == None:
        return jsonify({'message': 'user not found'})
    # need to check the string of password and username
    if check_password_hash(user.password, input_data['password']):
        user.current_user=True
        db.session.commit()
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

    new_user = User(
        username=input_data['username'], 
        email=input_data['email'], 
        password=generate_password_hash(input_data['password']),
        current_user=False)
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
            'email' : user.email,
            'current_user' : user.current_user})

    return jsonify({'users': users}), 201


'''
Method to show to the user to see informative stats about past drives so they can possibly optimise their future drives more
Will show Overall Pay, Overall Distance Driven, Overall Trips Fulfilled, Average Delivery Time, and Average Rate 
'''
@app.route('/get_statistics')
def get_stats():

    #Getting the currently logged in user
    current_user = User.query.filter_by(current_user=True).all()
    assert len(current_user) == 1, len(current_user)
    current_user = current_user[0]

    stat_list = Drive.query.filter_by(username=current_user.username).all()
    statistics = []

    def get_pay():
        overallPay = 0
        for stat in stat_list:
            overallPay = overallPay + stat.pay

        return round(overallPay, 2)
        
    def get_distance():
        overallDis = 0
        for stat in stat_list:
            overallDis = overallDis + stat.distance

        return round(overallDis, 2)
   
    def get_trips():
        return len(stat_list)

    def get_delivTime():
        overallDelivTime = 0
        for stat in stat_list:
            overallDelivTime = overallDelivTime + ((stat.end - stat.start).total_seconds() / 60)

        trips = len(stat_list)
        avgDelivTime = overallDelivTime / trips
        return round(avgDelivTime, 2)

    def get_rate():
        overallRate = 0
        for stat in stat_list:
            overallRate = overallRate + stat.rate
        trips = len(stat_list)
        avgRate = overallRate/trips
        return round(avgRate, 2)

    statistics.append({
        'Money Earned' : get_pay(),
        'Distance Driven' : get_distance(),
        'Trips ran' : get_trips(),
        'Average Delivery Time' : get_delivTime(),
        'Average Rate' : get_rate()
    })

    return jsonify({'statistics' : statistics}), 201

'''
Method to logout of the account
something about having to set up a login_manager for this to work I'm not sure, we'll figure it out later
@return message: TYPE - json ATTRIBUTES - 'message'
message:
    'user not logged in' - if there was no user logged in to sign out
    'logout successful' - if the user was logged out successfully
'''
@app.route('/logout')
def logout():

    #Find current user
    current_user = User.query.filter_by(current_user=True).all()
    assert len(current_user) <= 1, len(current_user)

    #If there is no current user
    if len(current_user) == 0:
        return jsonify({'message': 'user not logged in'})

    #If there is a current user, log them out
    else:
        current_user[0].current_user = False
        db.session.commit()
        return jsonify({'message': 'logout successful'})
    
'''
This method is just to put in dummy data so that it can be used for testing and such things like that
'''
def temp():

    
    '''portillos = Restaurant(
        restaurant_name='Portillos',
        average_wait=5
    )
    wendys = Restaurant(
        restaurant_name='Wendys',
        average_wait=2
    )
    chick = Restaurant(
        restaurant_name='Chick-Fil-A',
        average_wait=4
    )
    mac = Restaurant(
        restaurant_name='McDonalds',
        average_wait=1
    )
    db.session.add(portillos)
    db.session.add(wendys)
    db.session.add(chick)
    db.session.add(mac)
    db.session.commit()'''
    
    '''
    #Import the new data
    taxi_data = pd.read_csv("taxi_data.csv", low_memory=False)

    #Get and rename the columns that we want to use
    taxi_data = taxi_data = taxi_data[['lpep_pickup_datetime', 'lpep_dropoff_datetime', 'trip_distance', 'total_amount']]
    taxi_data = taxi_data.rename(columns={"lpep_pickup_datetime": "start", "lpep_dropoff_datetime": "end", "trip_distance": "distance", "total_amount": "pay"})
    
    #Only distances >= 1 mile and <= 10 miles, first 500 entries
    taxi_data = taxi_data.loc[taxi_data['distance'] >= 1]
    taxi_data = taxi_data.loc[taxi_data['distance'] <= 10]
    taxi_data = taxi_data[:500]
    taxi_data = taxi_data.reset_index(drop=True)

    #Add random restaurants and users to each of the drives
    restaurants = ['Portillos', 'Wendys', 'Chick-Fil-A', 'McDonalds']
    random_restaurant = np.random.choice(restaurants, 500)
    users = ['ianr', 'susannahb', 'andreat', 'jacksons']
    random_user = np.random.choice(users, 500)
    taxi_data['username'] = random_user
    taxi_data['restaurant_name'] = random_restaurant
    
    #Create all the other aspects of a drive that we will need and extrapolate from the data we have
    #Creating all the arrays for what we need
    start_arr = []
    end_arr = []
    restaurant_arrival = []
    restaurant_leave = []
    restaurant_time = []
    rate = []

    for index, drive in taxi_data.iterrows():
        #Parsing the start time, drive[0], and creating a datetime object
        temp = drive[0].replace('-', ' ').replace(':', ' ').split()
        start_time = datetime(int(temp[0]),int(temp[1]),int(temp[2]),int(temp[3]),int(temp[4]),int(temp[5]))
        start_arr.append(start_time)
        
        #Parsing the end time, drive[1], and creating a datetime object
        temp = drive[1].replace('-', ' ').replace(':', ' ').split()
        end_time = datetime(int(temp[0]),int(temp[1]),int(temp[2]),int(temp[3]),int(temp[4]),int(temp[5]))
        end_arr.append(end_time)
        
        #Total - (end - start) for later use
        total = end_time - start_time
        
        #Restaurant_arrival and restaurant_leave are abitrary just for data, doesn't really matter
        restaurant_arrival.append((start_time) + (total / 4))
        restaurant_leave.append((start_time) + (2 * (total / 4)))

        #Calculating restaurant_time from previous
        restaurant_time.append(((start_time) + (2 * (total / 4))) - ((start_time) + (total / 4)))

        #Calculating rate from previous
        rate.append((drive[3] * 60) / (total.total_seconds() / 60)) 
    
    #Adding all of this to the dataframe
    taxi_data['start'] = start_arr
    taxi_data['end'] = end_arr
    taxi_data['restaurant_arrival'] = restaurant_arrival
    taxi_data['restaurant_leave'] = restaurant_leave
    taxi_data['restaurant_time'] = restaurant_time
    taxi_data['rate'] = rate

    for index, drive in taxi_data.iterrows():
        to_add = Drive(
            restaurant_name=drive[5],
            start=drive[0].to_pydatetime(),
            end=drive[1].to_pydatetime(),
            distance=drive[2],
            pay=drive[3],
            username=drive[4],
            restaurant_arrival=drive[6].to_pydatetime(),
            restaurant_leave=drive[7].to_pydatetime(),
            restaurant_time=(drive[8].total_seconds()/60),
            rate=drive[9]
        )
        db.session.add(to_add)
    db.session.commit()'''

    '''users = User.query.all()

    for user in users:
        print('username: ' + str(user.username) + ' password: ' + str(user.password))


    restaurants = Restaurant.query.all()

    for restaurant in restaurants:
        print('name: ' + str(restaurant.restaurant_name) + ' rate: ' + str(restaurant.average_wait))'''

    current_user = User.query.filter_by(current_user=True).first()

    drives = Drive.query.filter_by(username=current_user.username).all()

    print(len(Drive.query.all()))



if __name__ == "__main__":
    temp()



        
    