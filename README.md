# Language Learning App

An interactive language learning platform featuring flashcards, quizzes, and pronunciation practice with gamification elements.

## Features

- Interactive flashcards
- Customizable quizzes
- Pronunciation practice
- Progress tracking
- Gamification (points, achievements)
- User authentication

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize the database:
```bash
flask db init
flask db migrate
flask db upgrade
```

4. Run the application:
```bash
flask run
```

## Project Structure

- `/app` - Main application package
  - `/static` - Static files (CSS, JS, images)
  - `/templates` - HTML templates
  - `/models` - Database models
  - `/routes` - Application routes
- `/migrations` - Database migrations
- `config.py` - Configuration settings
- `run.py` - Application entry point

## Credits

This project was created using [Windsurf](https://www.codeium.com/windsurf), the world's first agentic IDE. Windsurf is a revolutionary development environment that combines powerful AI capabilities with traditional IDE features to enhance the coding experience.

Powered by Codeium, Windsurf enables:
- Intelligent code generation and completion
- Interactive development assistance
- Seamless project management
- Advanced AI-powered features

For more information about Windsurf and Codeium, visit [codeium.com](https://www.codeium.com)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
