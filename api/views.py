from flask import Blueprint, jsonify, request
from . import db
from .models import Drive

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return jsonify(data="Landing page so it's not an error")

@main.route('/add_movie', methods=["POST"])
def add_movie():

    movie_data = request.get_json()

    new_drive = Drive(title=movie_data['title'], rating=movie_data['rating'])

    db.session.add(new_drive)
    db.session.commit()
    
    return "Done", 201

@main.route('/movies')
def movies():

    movie_list = Drive.query.all()
    movies = []

    for movie in movie_list:
        movies.append({'title' : movie.title, 'rating' : movie.rating})

    return jsonify({'movies': movies})