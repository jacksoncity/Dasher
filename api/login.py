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

class LoginForm(FlaskForm):
    username = StringField('username', validators=[InputRequired(), Length(min=5, max=20)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=40)])
    remember = BooleanField('remember me')

class RegisterForm(FlaskForm):
    username = StringField('username', validators=[InputRequired(), Length(min=5, max=20)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=40)])
    email = StringField('email', validators=[InputRequired(), Email(message='Invalid Email'), Length(max=50)])

@app.route('/')
def index():
    return jsonify(data="Landing page so it's not an error")

@app.route('/login', methods=['GET','POST'])
def login():
    form = LoginForm()
    
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if check_password_hash(user.password, form.password.data):
                login_user(user, remember=form.remember.data)
                return redirect(url_for('mainmenu'))
    return "login failed"

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = RegisterForm()

    if form.validate_on_submit():
        new_user = User(username=form.username.data, email=form.email.data, password=form.password.data)
        db.session.add(new_user)
        db.session.commit()
        return "new user had been created!"
    return