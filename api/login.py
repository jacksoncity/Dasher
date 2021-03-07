from . import db
from .models import User
from flask import Flask, render_template, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import Email, InputRequired, Length
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

app = Flask(__name__)
Bootstrap(app)

'''
A flaskfrom that hold all of the credentials of the user to be logged in
'''
class LoginForm(FlaskForm):
    username = StringField('username', validators=[InputRequired(), Length(min=5, max=20)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=40)])
    remember = BooleanField('remember me')

'''
A flaskfrom that hold all of the credentials of the user to be signed up for the app
'''
class RegisterForm(FlaskForm):
    username = StringField('username', validators=[InputRequired(), Length(min=5, max=20)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=40)])
    email = StringField('email', validators=[InputRequired(), Email(message='Invalid Email'), Length(max=50)])


@app.route('/')
def index():
    return jsonify(data="Landing page so it's not an error")


'''
This method allows the user to login and access the main page of the app should the 
credentials of the login be valid, otherwise it fails the login and they are returned 
to a blank login page again.
'''
@app.route('/login', methods=['GET','POST'])
def login():
    form = LoginForm()
    
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if check_password_hash(user.password, form.password.data):
                login_user(user, remember=form.remember.data)
                return redirect(url_for('mainmenu')) #this needs to return the user to the main page but idk how to do that quite yet lmao
    return "login failed"

'''
This method is the gernal purpose signup that allows the user to be able to login to the app
should the input credentials be valid
'''
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = RegisterForm()

    if form.validate_on_submit():
        new_user = User(username=form.username.data, email=form.email.data, password=form.password.data)
        db.session.add(new_user)
        db.session.commit()
        return "new user had been created!" #then needs to return the user to the login page

    return #needs to return the user to the login page

'''
On logout this method returns the user to the login page as they cannot access the app if not logged in.
'''

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))