document.getElementById('quizForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const data = {
        subject: document.getElementById('subject').value,
        num_questions: 5,
        details: "Anpassa frågorna till skolverkets nivå"
    };

    const response = await fetch('/generate_quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result.questions);
});
