from flask import Flask, render_template, request, jsonify, session, redirect, url_for, make_response
import json
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

def load_quiz_data():
    with open('data/quiz.json', 'r') as f:
        return json.load(f)

def get_quiz_answers_from_cookies():
    answers = request.cookies.get('quiz_answers')
    if answers:
        return json.loads(answers)
    return {}

@app.route('/')
def home():
    session.clear()
    return render_template('home.html')

@app.route('/intro')
def intro():
    session['completed_intro'] = True
    return render_template('intro.html')

@app.route('/techniques')
def techniques():
    return render_template('techniques.html')

@app.route('/examples')
def examples():
    return render_template('examples.html')

@app.route('/quiz')
def quiz():
    if not session.get('completed_intro'):
        return redirect(url_for('intro'))
    return redirect(url_for('quiz_specific', question_id=1))

@app.route('/quiz/<int:question_id>')
def quiz_specific(question_id):
    if not session.get('completed_intro'):
        return redirect(url_for('intro'))
    
    quiz_data = load_quiz_data()
    if question_id > len(quiz_data):
        return "Question not found", 404
    
    # Get answers from cookies
    quiz_answers = get_quiz_answers_from_cookies()
    
    return render_template('quiz.html', 
                         question=quiz_data[question_id-1], 
                         question_id=question_id,
                         saved_answer=quiz_answers.get(str(question_id)))

@app.route('/store_answer', methods=['POST'])
def store_answer():
    data = request.get_json()
    question_id = str(data.get('question_id'))
    answer_value = data.get('answer_value')  # Store the actual answer value
    is_correct = data.get('is_correct')
    
    # Get existing answers from cookies
    quiz_answers = get_quiz_answers_from_cookies()
    
    # Update answers
    quiz_answers[question_id] = {
        'value': answer_value,
        'is_correct': is_correct
    }
    
    # Create response
    response = make_response(jsonify({
        'status': 'success', 
        'stored_answers': quiz_answers
    }))
    
    # Set cookie with updated answers
    response.set_cookie('quiz_answers', json.dumps(quiz_answers), max_age=86400)  # Expires in 24 hours
    
    return response

@app.route('/results')
def results():
    quiz_answers = get_quiz_answers_from_cookies()
    
    # Calculate correct answers
    correct_answers = sum(1 for answer in quiz_answers.values() if answer.get('is_correct'))
    
    # Create response with results template
    response = make_response(render_template('results.html', correct_answers=correct_answers))
    
    # Clear the quiz answers cookie
    response.delete_cookie('quiz_answers')
    
    return response

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000) 