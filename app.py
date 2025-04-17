from flask import Flask, render_template, request, jsonify, session, redirect, url_for
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
    session.clear()  # Reset session when returning to home
    return render_template('home.html')

@app.route('/learn/<int:lesson_id>')
def learn(lesson_id):
    lessons = load_lesson_data()
    if lesson_id > len(lessons):
        return "Lesson not found", 404
    
    # Check if user has completed previous lessons
    if lesson_id > 1 and not session.get(f'completed_lesson_{lesson_id-1}'):
        return redirect(url_for('learn', lesson_id=lesson_id-1))
    
    # Mark current lesson as completed
    session[f'completed_lesson_{lesson_id}'] = True
    
    return render_template('learn.html', lesson=lessons[lesson_id-1], lesson_id=lesson_id)

@app.route('/quiz/<int:question_id>')
def quiz(question_id):
    # Ensure user has completed all lessons
    if not session.get('completed_lesson_3'):
        return redirect(url_for('learn', lesson_id=3))
    
    quiz_data = load_quiz_data()
    if question_id > len(quiz_data):
        return "Question not found", 404
    
    return render_template('quiz.html', question=quiz_data[question_id-1], question_id=question_id)

@app.route('/results')
def results():
    return render_template('results.html')

if __name__ == '__main__':
    app.run(debug=True) 