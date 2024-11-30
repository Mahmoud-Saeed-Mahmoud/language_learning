from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Flashcard, UserProgress, db
from datetime import datetime

bp = Blueprint('flashcards', __name__)

@bp.route('/api/flashcards')
@login_required
def get_flashcards():
    language = request.args.get('language', 'en')
    category = request.args.get('category')
    
    query = Flashcard.query.filter_by(language=language)
    if category:
        query = query.filter_by(category=category)
    
    flashcards = query.all()
    return jsonify([{
        'id': card.id,
        'front': card.front,
        'back': card.back,
        'category': card.category,
        'difficulty': card.difficulty
    } for card in flashcards])

@bp.route('/api/flashcards/progress', methods=['POST'])
@login_required
def update_progress():
    data = request.get_json()
    flashcard_id = data.get('flashcard_id')
    familiarity = data.get('familiarity')
    
    progress = UserProgress.query.filter_by(
        user_id=current_user.id,
        flashcard_id=flashcard_id
    ).first()
    
    if not progress:
        progress = UserProgress(
            user_id=current_user.id,
            flashcard_id=flashcard_id
        )
        db.session.add(progress)
    
    progress.familiarity = familiarity
    progress.last_reviewed = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'status': 'success'})
