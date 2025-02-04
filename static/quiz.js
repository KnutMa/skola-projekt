let quizData = JSON.parse(localStorage.getItem("quiz")) || [];
let currentQuestionIndex = 0;

function showQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        document.getElementById("quiz-container").innerHTML = "<h2>Quiz klart!</h2>";
        return;
    }

    let questionObj = quizData[currentQuestionIndex];
    document.getElementById("question").textContent = questionObj.question;
    document.getElementById("answer").value = "";
    document.getElementById("feedback").textContent = "";
}

function checkAnswer() {
    let userAnswer = document.getElementById("answer").value.trim().toLowerCase();
    let correctAnswer = quizData[currentQuestionIndex].answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        document.getElementById("feedback").textContent = "Rätt!";
    } else {
        document.getElementById("feedback").textContent = `Fel. Rätt svar: ${correctAnswer}`;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

window.onload = showQuestion;
