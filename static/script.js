// Rymdeffekter
function createSpaceEffects() {
    // Stjärnor
    for(let i = 0; i < 300; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(star);
    }

    // Meteorer
    setInterval(() => {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        meteor.style.left = Math.random() * 100 + 'vw';
        meteor.style.top = Math.random() * 100 + 'vh';
        document.body.appendChild(meteor);
        setTimeout(() => meteor.remove(), 3000);
    }, 3000);
}

// Quiz-logik
let currentQuestionIndex = 0;
let questions = [];
let userAnswers = [];

function initQuiz() {
    const storedQuiz = localStorage.getItem('quiz');
    if (!storedQuiz) {
        window.location.href = '/';
        return;
    }
    
    questions = JSON.parse(storedQuiz);
    if (questions.length === 0) {
        window.location.href = '/';
        return;
    }
    
    currentQuestionIndex = 0;
    userAnswers = [];
    renderQuestion();
}

function renderQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('answer-input').value = '';
    
    if (currentQuestionIndex === questions.length - 1) {
        document.getElementById('next-button').style.display = 'none';
        document.getElementById('submit-button').style.display = 'block';
    } else {
        document.getElementById('next-button').style.display = 'block';
        document.getElementById('submit-button').style.display = 'none';
    }
}

window.nextQuestion = () => {
    userAnswers.push(document.getElementById('answer-input').value);
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
};

window.submitQuiz = async () => {
    userAnswers.push(document.getElementById('answer-input').value);
    const results = [];
    for (let i = 0; i < questions.length; i++) {
        const isCorrect = await fetch('/is_answer_correct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_answer: userAnswers[i],
                correct_answer: questions[i].answer
            })
        }).then(response => response.json()).then(data => data.is_correct);
        results.push({
            question: questions[i].question,
            userAnswer: userAnswers[i],
            correctAnswer: questions[i].answer,
            isCorrect: isCorrect
        });
    }
    localStorage.setItem('quizResults', JSON.stringify(results));
    window.location.href = '/result';
};

// Flashcards-logik
let currentFlashcardIndex = 0;
let flashcards = [];

function initFlashcards() {
    const storedFlashcards = localStorage.getItem('flashcards');
    if (!storedFlashcards) {
        window.location.href = '/';
        return;
    }
    
    flashcards = JSON.parse(storedFlashcards);
    if (flashcards.length === 0) {
        window.location.href = '/';
        return;
    }
    
    currentFlashcardIndex = 0;
    renderFlashcard();
}

function renderFlashcard() {
    const card = flashcards[currentFlashcardIndex];
    document.getElementById('term-text').textContent = card.term;
    document.getElementById('definition-text').textContent = card.definition;
    document.getElementById('card-counter').textContent = `${currentFlashcardIndex + 1}/${flashcards.length}`;
}

window.flipCard = (element) => {
    element.classList.toggle('flipped');
};

window.nextCard = () => {
    if (currentFlashcardIndex < flashcards.length - 1) {
        currentFlashcardIndex++;
        const cardElement = document.querySelector('.flashcard');
        if (cardElement.classList.contains('flipped')) {
            cardElement.classList.remove('flipped');
        }
        renderFlashcard();
    }
};

window.prevCard = () => {
    if (currentFlashcardIndex > 0) {
        currentFlashcardIndex--;
        const cardElement = document.querySelector('.flashcard');
        if (cardElement.classList.contains('flipped')) {
            cardElement.classList.remove('flipped');
        }
        renderFlashcard();
    }
};

// Generera innehåll
async function generateContent(type) {
    const formData = {
        type: type,
        grade: document.getElementById('grade').value,
        subject: document.getElementById('subject').value,
        details: document.getElementById('details').value,
        num_items: document.getElementById('num_items').value
    };

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        localStorage.setItem(type, JSON.stringify(data.data));
        window.location.href = `/${type}`;
    } catch (error) {
        console.error('Error:', error);
        alert('Fel: ' + error.message);
    }
}

// Initiera
window.addEventListener('DOMContentLoaded', () => {
    createSpaceEffects();
    
    if(window.location.pathname === '/quiz') {
        initQuiz();
    } 
    else if(window.location.pathname === '/flashcards') {
        initFlashcards();
    }
    else if(window.location.pathname === '/result') {
        renderResults();
    }
});

// Resultat-logik
function renderResults() {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    const container = document.getElementById('results-container');
    
    if (!results.length) {
        container.innerHTML = '<p>Inga resultat hittades</p>';
        return;
    }

    container.innerHTML = results.map((result, i) => `
        <div class="result-card ${result.isCorrect ? 'correct' : 'wrong'}">
            <h3>Fråga ${i + 1}</h3>
            <p>${result.question}</p>
            <p>Ditt svar: ${result.userAnswer || '-'}</p>
            <p>Rätt svar: ${result.correctAnswer}</p>
        </div>
    `).join('');
}
