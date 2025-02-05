async function generateContent(type) {
    const subject = document.getElementById('subject').value;
    const grade = document.getElementById('grade').value || "okänd"; // Lägger till grade
    const details = document.getElementById('details').value;
    const numItems = document.getElementById('num_items').value;

    if (!subject || !details || !numItems) {
        alert("Fyll i alla fält!");
        return;
    }

    // Spara data till localStorage innan vi byter sida
    localStorage.setItem("quiz_type", type);
    localStorage.setItem("loading", "true");

    // Skicka användaren till loading.html medan vi väntar på API-anropet
    window.location.href = "/loading";

    try {
        const response = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type,
                subject,
                grade,
                details,
                num_items: numItems
            })
        });

        if (!response.ok) {
            throw new Error("Fel vid hämtning av API-data.");
        }

        const data = await response.json();
        localStorage.setItem(type, JSON.stringify(data.data));

        // Markera att genereringen är klar
        localStorage.setItem("loading", "false");

        // Skicka användaren till rätt sida
        window.location.href = `/${type}`;
    } catch (error) {
        console.error("Fel:", error);
        alert("Något gick fel, försök igen.");
        window.location.href = "/";
    }
}

// Kontrollera om vi är på loading.html och skicka vidare när datan är klar
window.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/loading") {
        const quizType = localStorage.getItem("quiz_type");
        const isLoading = localStorage.getItem("loading");

        if (quizType && isLoading === "false") {
            window.location.href = `/${quizType}`;
        } else {
            // Kolla igen efter 1 sekund
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
});