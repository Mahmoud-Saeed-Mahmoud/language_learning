// Flashcard functionality
class Flashcard {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.createFlashcard();
    }

    createFlashcard() {
        const flashcard = document.createElement('div');
        flashcard.className = 'flashcard';
        flashcard.innerHTML = `
            <div class="flashcard-inner">
                <div class="flashcard-front">${this.data.front}</div>
                <div class="flashcard-back">${this.data.back}</div>
            </div>
        `;
        
        flashcard.addEventListener('click', () => {
            flashcard.classList.toggle('flipped');
        });
        
        this.container.appendChild(flashcard);
    }
}

// Quiz functionality
class Quiz {
    constructor(container, quizData) {
        this.container = container;
        this.quizData = quizData;
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = {};
    }

    renderQuestion() {
        const question = this.quizData.questions[this.currentQuestion];
        const template = `
            <div class="quiz-question">
                <h3>${question.question}</h3>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="question${question.id}" value="${option}" id="option${index}">
                            <label class="form-check-label" for="option${index}">${option}</label>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary mt-3" onclick="quiz.submitAnswer()">Submit Answer</button>
            </div>
        `;
        this.container.innerHTML = template;
    }

    async submitAnswer() {
        const selectedOption = document.querySelector(`input[name="question${this.quizData.questions[this.currentQuestion].id}"]:checked`);
        if (!selectedOption) return;

        this.answers[this.quizData.questions[this.currentQuestion].id] = selectedOption.value;
        
        if (this.currentQuestion === this.quizData.questions.length - 1) {
            await this.submitQuiz();
        } else {
            this.currentQuestion++;
            this.renderQuestion();
        }
    }

    async submitQuiz() {
        try {
            const response = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quiz_id: this.quizData.id,
                    answers: this.answers
                })
            });
            
            const result = await response.json();
            this.showResults(result);
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    }

    showResults(result) {
        const template = `
            <div class="quiz-results text-center">
                <h2>Quiz Complete!</h2>
                <p>Score: ${result.score}%</p>
                <p>Points earned: ${result.points_earned}</p>
                <p>New total points: ${result.new_total_points}</p>
                <p>Current level: ${result.level}</p>
                <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
            </div>
        `;
        this.container.innerHTML = template;
    }
}

// Pronunciation practice
class PronunciationPractice {
    constructor(container) {
        this.container = container;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.setupRecording();
    }

    async setupRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            
            this.mediaRecorder.addEventListener('dataavailable', event => {
                this.audioChunks.push(event.data);
            });

            this.mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(this.audioChunks);
                this.audioChunks = [];
                this.processAudio(audioBlob);
            });

            this.renderUI();
        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error accessing microphone. Please check permissions.</div>';
        }
    }

    renderUI() {
        const template = `
            <div class="pronunciation-container">
                <button class="microphone-button">
                    <i class="fas fa-microphone"></i>
                </button>
                <div id="result" class="mt-3"></div>
            </div>
        `;
        this.container.innerHTML = template;

        const button = this.container.querySelector('.microphone-button');
        button.addEventListener('click', () => this.toggleRecording());
    }

    toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        this.isRecording = true;
        this.mediaRecorder.start();
        this.container.querySelector('.microphone-button').classList.add('recording');
    }

    stopRecording() {
        this.isRecording = false;
        this.mediaRecorder.stop();
        this.container.querySelector('.microphone-button').classList.remove('recording');
    }

    async processAudio(audioBlob) {
        // In a real implementation, you would send this audio to a speech recognition service
        // For now, we'll just show a placeholder result
        const resultDiv = this.container.querySelector('#result');
        resultDiv.innerHTML = '<div class="alert alert-success">Audio processed successfully!</div>';
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize flashcards if container exists
    const flashcardsContainer = document.getElementById('flashcards-container');
    if (flashcardsContainer) {
        fetch('/api/flashcards')
            .then(response => response.json())
            .then(flashcards => {
                flashcards.forEach(data => new Flashcard(flashcardsContainer, data));
            });
    }

    // Initialize quiz if container exists
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        const quizId = quizContainer.dataset.quizId;
        fetch(`/api/quiz/${quizId}`)
            .then(response => response.json())
            .then(quizData => {
                window.quiz = new Quiz(quizContainer, quizData);
                window.quiz.renderQuestion();
            });
    }

    // Initialize pronunciation practice if container exists
    const pronunciationContainer = document.getElementById('pronunciation-container');
    if (pronunciationContainer) {
        new PronunciationPractice(pronunciationContainer);
    }
});
