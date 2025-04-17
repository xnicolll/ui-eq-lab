from flask import Flask, render_template, request, jsonify, session
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Change this in production

# Load lesson data
def load_lesson_data():
    with open('data/lessons.json', 'r') as f:
        return json.load(f)

# Load quiz data
def load_quiz_data():
    with open('data/quiz.json', 'r') as f:
        return json.load(f)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn/<int:lesson_id>')
def learn(lesson_id):
    lessons = load_lesson_data()
    if lesson_id > len(lessons):
        return "Lesson not found", 404
    return render_template('learn.html', lesson=lessons[lesson_id-1], lesson_id=lesson_id)

@app.route('/quiz/<int:question_id>')
def quiz(question_id):
    quiz_data = load_quiz_data()
    if question_id > len(quiz_data):
        return "Question not found", 404
    return render_template('quiz.html', question=quiz_data[question_id-1], question_id=question_id)

@app.route('/results')
def results():
    return render_template('results.html')

if __name__ == '__main__':
    app.run(debug=True) 