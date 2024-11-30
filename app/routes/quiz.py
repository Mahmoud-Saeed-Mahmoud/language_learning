from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Quiz, QuizQuestion, User, db
import json

bp = Blueprint('quiz', __name__)

@bp.route('/api/quizzes')
@login_required
def get_quizzes():
    language = request.args.get('language', 'en')
    difficulty = request.args.get('difficulty', type=int)
    
    query = Quiz.query.filter_by(language=language)
    if difficulty:
        query = query.filter_by(difficulty=difficulty)
    
    quizzes = query.all()
    return jsonify([{
        'id': quiz.id,
        'title': quiz.title,
        'language': quiz.language,
        'difficulty': quiz.difficulty
    } for quiz in quizzes])

@bp.route('/api/quiz/<int:quiz_id>')
@login_required
def get_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    questions = [{
        'id': q.id,
        'question': q.question,
        'options': json.loads(q.options)
    } for q in quiz.questions]
    
    return jsonify({
        'id': quiz.id,
        'title': quiz.title,
        'questions': questions
    })

@bp.route('/api/quiz/submit', methods=['POST'])
@login_required
def submit_quiz():
    data = request.get_json()
    quiz_id = data.get('quiz_id')
    answers = data.get('answers', {})
    
    quiz = Quiz.query.get_or_404(quiz_id)
    correct_count = 0
    total_questions = len(quiz.questions)
    
    for question in quiz.questions:
        if str(question.id) in answers and answers[str(question.id)] == question.correct_answer:
            correct_count += 1
    
    score = (correct_count / total_questions) * 100
    points_earned = int(score * quiz.difficulty)
    
    current_user.points += points_earned
    if current_user.points >= current_user.level * 1000:
        current_user.level += 1
    
    db.session.commit()
    
    return jsonify({
        'score': score,
        'points_earned': points_earned,
        'new_total_points': current_user.points,
        'level': current_user.level
    })
