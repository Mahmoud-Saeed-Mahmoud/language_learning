from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import Config

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    from app.routes import main, auth, flashcards, quiz
    app.register_blueprint(main.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(flashcards.bp)
    app.register_blueprint(quiz.bp)

    return app
