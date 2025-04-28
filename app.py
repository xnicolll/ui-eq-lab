from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import json
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

def load_lesson_data():
    with open('data/lessons.json', 'r') as f:
        return json.load(f)

def load_quiz_data():
    with open('data/quiz.json', 'r') as f:
        return json.load(f)

@app.route('/')
def home():
    session.clear()
    return render_template('home.html')

@app.route('/intro')
def intro():
    return render_template('intro.html', current_step=1)

@app.route('/techniques')
def techniques():
    return render_template('techniques.html')

@app.route('/examples')
def examples():
    return render_template('examples.html')

@app.route('/quiz')
def quiz():
    if not session.get('completed_lesson_3'):
        return redirect(url_for('learn_specific', lesson_id=3))
    session['quiz_answers'] = {}  # Initialize empty answers dict
    return redirect(url_for('quiz_specific', question_id=1))

@app.route('/learn/<int:lesson_id>')
def learn_specific(lesson_id):
    lessons = load_lesson_data()
    if lesson_id > len(lessons):
        return "Lesson not found", 404
    
    if lesson_id > 1 and not session.get(f'completed_lesson_{lesson_id-1}'):
        return redirect(url_for('learn_specific', lesson_id=lesson_id-1))
    
    session[f'completed_lesson_{lesson_id}'] = True
    return render_template('learn.html', lesson=lessons[lesson_id-1], lesson_id=lesson_id)

@app.route('/quiz/<int:question_id>')
def quiz_specific(question_id):
    if not session.get('completed_lesson_3'):
        return redirect(url_for('learn_specific', lesson_id=3))
    
    quiz_data = load_quiz_data()
    if question_id > len(quiz_data):
        return "Question not found", 404
    
    # Initialize quiz_answers if not exists
    if 'quiz_answers' not in session:
        session['quiz_answers'] = {}
    
    return render_template('quiz.html', question=quiz_data[question_id-1], question_id=question_id)

@app.route('/store_answer', methods=['POST'])
def store_answer():
    data = request.get_json()
    question_id = str(data.get('question_id'))
    is_correct = data.get('is_correct')
    
    # Initialize quiz_answers if not exists
    if 'quiz_answers' not in session:
        session['quiz_answers'] = {}
    
    # Create a new dictionary with the updated answer
    answers = dict(session['quiz_answers'])
    answers[question_id] = is_correct
    
    # Update the session with the new answers
    session['quiz_answers'] = answers
    session.modified = True
    
    return jsonify({'status': 'success', 'stored_answers': session['quiz_answers']})

@app.route('/results')
def results():
    if 'quiz_answers' not in session:
        return redirect(url_for('quiz'))
    
    # Calculate correct answers
    correct_answers = sum(1 for answer in session['quiz_answers'].values() if answer)
    
    # Debug print
    print("Quiz Answers:", session['quiz_answers'])
    print("Correct Answers:", correct_answers)
    
    return render_template('results.html', correct_answers=correct_answers)

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000) 