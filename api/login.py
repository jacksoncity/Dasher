from . import db
from .models import User
from flask import Flask, render_template, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import Email, InputRequired, Length

app = Flask(__name__)
Bootstrap(app)

class LoginForm(FlaskForm):
    username = StringField('username', validators=[InputRequired(), Length(min=5, max=20)])
    Password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=40)])
    remember = BooleanField('remember me')

@app.route('/')
def index():
    return jsonify(data="Landing page so it's not an error")

@app.route('/login', methods=['GET','POST'])
def login():
    form = LoginForm()
    
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if user.password == form.password.data:
                return redirect(url_for('mainmenu'))
    return "login failed"