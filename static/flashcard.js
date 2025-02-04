let flashcardData = JSON.parse(localStorage.getItem("flashcards")) || [];
let currentCardIndex = 0;
let flipped = false;

function showCard() {
    if (currentCardIndex >= flashcardData.length) {
        document.getElementById("flashcard-container").innerHTML = "<h2>Inga fler kort!</h2>";
        return;
    }

    let card = flashcardData[currentCardIndex];
    document.getElementById("term").textContent = card.term;
    document.getElementById("definition").textContent = card.definition;
    document.getElementById("definition").style.display = "none";
    flipped = false;
}

function flipCard() {
    if (flipped) {
        document.getElementById("definition").style.display = "none";
    } else {
        document.getElementById("definition").style.display = "block";
    }
    flipped = !flipped;
}

function nextCard() {
    currentCardIndex++;
    showCard();
}

window.onload = showCard;
