async function generateContent(type) {
   const grade = document.getElementById('grade').value;
   const subject = document.getElementById('subject').value;
   const details = document.getElementById('details').value;
   const numItems = document.getElementById('num_items').value;

   if (!grade || !subject || !details || !numItems) {
       alert("Fyll i alla fält!");
       return;
   }

   try {
       console.log("Skickar förfrågan till API...");
      
       const response = await fetch('/generate', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
               type: type,
               subject: subject,
               grade: grade,
               details: details,
               num_items: numItems
           })
       });

       if (!response.ok) {
           const errorData = await response.json();
           throw new Error(errorData.error || "API-anropet misslyckades.");
       }

       const data = await response.json();
       console.log("Mottagen data:", data);

       localStorage.setItem(type, JSON.stringify(data.data));
       window.location.href = `/${type}`;

   } catch (error) {
       console.error("Fel:", error);
       alert("Fel: " + error.message);
   }
}

// Ladda innehåll när sidan laddas
window.addEventListener('DOMContentLoaded', () => {
   const path = window.location.pathname;
  
   if (path === '/quiz') {
       const questions = JSON.parse(localStorage.getItem('quiz'));
       renderQuiz(questions);
   } else if (path === '/flashcards') {
       const flashcards = JSON.parse(localStorage.getItem('flashcards'));
       renderFlashcards(flashcards);
   }
});

function renderQuiz(questions) {
   const container = document.getElementById('quiz-container');
   if (!questions || questions.length === 0) {
       container.innerHTML = "<p>Inga frågor hittades 😢</p>";
       return;
   }

   let currentQuestionIndex = 0;

   function showQuestion(index) {
       const question = questions[index];
       container.innerHTML = `
           <p id="question-text">${question.question}</p>
           <input type="text" id="answer-input" placeholder="Skriv ditt svar här">
           <button id="next-button" onclick="nextQuestion()">Nästa fråga</button>
           <button id="submit-button" onclick="submitQuiz()" style="display: none;">Skicka in quiz</button>
       `;
   }

   window.nextQuestion = function() {
       currentQuestionIndex++;
       if (currentQuestionIndex < questions.length) {
           showQuestion(currentQuestionIndex);
       } else {
           document.getElementById('next-button').style.display = 'none';
           document.getElementById('submit-button').style.display = 'block';
       }
   };

   window.submitQuiz = function() {
       alert("Quiz skickat!");
       // Här kan du lägga till logik för att hantera inskickade svar
   };

   showQuestion(currentQuestionIndex);
}

function renderFlashcards(flashcards) {
   const container = document.getElementById('flashcardContainer');
   if (!flashcards || flashcards.length === 0) {
       container.innerHTML = "<p>Inga flashcards hittades 😢</p>";
       return;
   }

   container.innerHTML = flashcards.map(card => `
       <div class="flashcard" onclick="this.classList.toggle('flipped')">
           <div class="front">${card.term}</div>
           <div class="back">${card.definition}</div>
       </div>
   `).join('');
}
