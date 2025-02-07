const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const meteors = [];
const numStars = 200;
const numMeteors = 5;

function createStars() {
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            speed: Math.random() * 0.5
        });
    }
}

function createMeteors() {
    for (let i = 0; i < numMeteors; i++) {
        meteors.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.5,
            length: Math.random() * 30 + 20,
            speed: Math.random() * 4 + 2
        });
    }
}

function drawStars() {
    ctx.fillStyle = "white";
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

function drawMeteors() {
    ctx.strokeStyle = "rgba(255, 165, 0, 0.8)";
    ctx.lineWidth = 2;
    meteors.forEach(meteor => {
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.length, meteor.y + meteor.length);
        ctx.stroke();
    });
}

function updateMeteors() {
    meteors.forEach(meteor => {
        meteor.x -= meteor.speed;
        meteor.y += meteor.speed;
        if (meteor.x < -meteor.length || meteor.y > canvas.height) {
            meteor.x = Math.random() * canvas.width;
            meteor.y = Math.random() * canvas.height * 0.5;
        }
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    updateStars();
    drawMeteors();
    updateMeteors();
    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

createStars();
createMeteors();
animate();
