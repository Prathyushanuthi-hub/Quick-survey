class SurveyApp {
    constructor() {
        this.surveyData = null;
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.init();
    }

    async init() {
        try {
            await this.loadSurveyData();
            this.setupEventListeners();
            this.showWelcomeScreen();
        } catch (error) {
            console.error('Failed to initialize survey:', error);
            this.showError('Failed to load survey data. Please refresh the page.');
        }
    }

    async loadSurveyData() {
        try {
            const response = await fetch('survey-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.surveyData = await response.json();
        } catch (error) {
            console.error('Error loading survey data:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Start survey button
        document.getElementById('start-survey').addEventListener('click', () => {
            this.startSurvey();
        });

        // Navigation buttons
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.previousQuestion();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });

        // Restart survey button
        document.getElementById('restart-survey').addEventListener('click', () => {
            this.restartSurvey();
        });
    }

    showWelcomeScreen() {
        this.hideAllScreens();
        document.getElementById('welcome-screen').classList.add('active');
    }

    startSurvey() {
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.showSurveyScreen();
        this.displayQuestion();
    }

    showSurveyScreen() {
        this.hideAllScreens();
        document.getElementById('survey-screen').classList.add('active');
    }

    showResultsScreen() {
        this.hideAllScreens();
        document.getElementById('results-screen').classList.add('active');
        this.displayResults();
    }

    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }

    displayQuestion() {
        const question = this.surveyData.questions[this.currentQuestionIndex];
        const totalQuestions = this.surveyData.questions.length;

        // Update progress
        const progressPercent = ((this.currentQuestionIndex + 1) / totalQuestions) * 100;
        document.getElementById('progress-fill').style.width = `${progressPercent}%`;
        document.getElementById('progress-text').textContent = 
            `Question ${this.currentQuestionIndex + 1} of ${totalQuestions}`;

        // Update question content
        document.getElementById('question-title').textContent = question.title;
        document.getElementById('question-description').textContent = question.description || '';

        // Create options based on question type
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        switch (question.type) {
            case 'multiple-choice':
                this.createMultipleChoiceOptions(question, optionsContainer);
                break;
            case 'rating':
                this.createRatingOptions(question, optionsContainer);
                break;
            case 'text':
                this.createTextInput(question, optionsContainer);
                break;
        }

        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Restore previous answer if exists
        this.restorePreviousAnswer(question);
    }

    createMultipleChoiceOptions(question, container) {
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.dataset.value = option;
            
            optionElement.addEventListener('click', () => {
                // Remove selection from all options
                container.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Select clicked option
                optionElement.classList.add('selected');
                this.answers[question.id] = option;
                this.updateNavigationButtons();
            });

            container.appendChild(optionElement);
        });
    }

    createRatingOptions(question, container) {
        const ratingContainer = document.createElement('div');
        ratingContainer.className = 'rating-container';

        for (let i = 1; i <= question.scale; i++) {
            const ratingOption = document.createElement('div');
            ratingOption.className = 'rating-option';
            ratingOption.textContent = i;
            ratingOption.dataset.value = i;

            ratingOption.addEventListener('click', () => {
                // Remove selection from all ratings
                ratingContainer.querySelectorAll('.rating-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Select clicked rating
                ratingOption.classList.add('selected');
                this.answers[question.id] = i;
                this.updateNavigationButtons();
            });

            ratingContainer.appendChild(ratingOption);
        }

        container.appendChild(ratingContainer);

        // Add labels if provided
        if (question.labels) {
            const labelsContainer = document.createElement('div');
            labelsContainer.className = 'rating-labels';
            labelsContainer.innerHTML = `
                <span>${question.labels.low}</span>
                <span>${question.labels.high}</span>
            `;
            container.appendChild(labelsContainer);
        }
    }

    createTextInput(question, container) {
        const textInput = document.createElement('textarea');
        textInput.className = 'text-input';
        textInput.placeholder = question.placeholder || 'Enter your answer...';
        textInput.rows = 4;

        textInput.addEventListener('input', () => {
            this.answers[question.id] = textInput.value;
            this.updateNavigationButtons();
        });

        container.appendChild(textInput);
    }

    restorePreviousAnswer(question) {
        const previousAnswer = this.answers[question.id];
        if (!previousAnswer) return;

        const container = document.getElementById('options-container');

        switch (question.type) {
            case 'multiple-choice':
                const option = container.querySelector(`[data-value="${previousAnswer}"]`);
                if (option) option.classList.add('selected');
                break;
            case 'rating':
                const rating = container.querySelector(`[data-value="${previousAnswer}"]`);
                if (rating) rating.classList.add('selected');
                break;
            case 'text':
                const textInput = container.querySelector('.text-input');
                if (textInput) textInput.value = previousAnswer;
                break;
        }
    }

    updateNavigationButtons() {
        const currentQuestion = this.surveyData.questions[this.currentQuestionIndex];
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        // Previous button
        prevBtn.disabled = this.currentQuestionIndex === 0;

        // Next button
        const hasAnswer = this.answers[currentQuestion.id] !== undefined && 
                         this.answers[currentQuestion.id] !== '';
        const isRequired = currentQuestion.required;
        
        nextBtn.disabled = isRequired && !hasAnswer;
        
        // Update next button text for last question
        if (this.currentQuestionIndex === this.surveyData.questions.length - 1) {
            nextBtn.textContent = 'Complete Survey';
        } else {
            nextBtn.textContent = 'Next';
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.surveyData.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        } else {
            // Survey completed
            this.completeSurvey();
        }
    }

    completeSurvey() {
        this.showResultsScreen();
    }

    displayResults() {
        const summaryContainer = document.getElementById('survey-summary');
        summaryContainer.innerHTML = '';

        // Create summary of answers
        this.surveyData.questions.forEach(question => {
            const answer = this.answers[question.id];
            if (answer !== undefined && answer !== '') {
                const summaryItem = document.createElement('div');
                summaryItem.className = 'summary-item';
                
                const questionElement = document.createElement('div');
                questionElement.className = 'summary-question';
                questionElement.textContent = question.title;
                
                const answerElement = document.createElement('div');
                answerElement.className = 'summary-answer';
                
                if (question.type === 'rating') {
                    answerElement.textContent = `${answer} out of ${question.scale}`;
                } else {
                    answerElement.textContent = answer;
                }
                
                summaryItem.appendChild(questionElement);
                summaryItem.appendChild(answerElement);
                summaryContainer.appendChild(summaryItem);
            }
        });

        // If no answers recorded, show a message
        if (summaryContainer.children.length === 0) {
            summaryContainer.innerHTML = '<p style="text-align: center; color: #666;">No responses recorded.</p>';
        }
    }

    restartSurvey() {
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.showWelcomeScreen();
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4757;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
            z-index: 1000;
            font-weight: 500;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 5000);
    }
}

// Initialize the survey app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SurveyApp();
});

// Add some nice interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn') || e.target.classList.contains('option')) {
            const element = e.target;
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});