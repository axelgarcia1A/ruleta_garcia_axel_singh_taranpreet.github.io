const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const updateButton = document.getElementById("updateButton");

let segments = [];
let rotation = 0;
let spinning = false;

const colors = [
    "#f39c12", "#8e44ad", "#e74c3c", "#3498db", "#2ecc71",
    "#9b59b6", "#e67e22", "#1abc9c", "#c0392b", "#16a085"
];

// Función para cargar nombres automáticamente desde 'nombres.txt'
function loadNames() {
    fetch('nombres.txt')
        .then(response => response.text())
        .then(data => {
            const names = data.trim().split("\n").filter(n => n);
            if (names.length === 0) {
                alert("El archivo de nombres está vacío.");
                return;
            }
            segments = names;
            createWheel();
            alert("¡Nombres cargados correctamente!");
        })
        .catch(error => {
            alert("No se pudo cargar el archivo de nombres.");
            console.error("Error al cargar nombres:", error);
        });
}

// Función para dibujar la ruleta
function createWheel() {
    const totalSegments = segments.length;
    const arc = (2 * Math.PI) / totalSegments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < totalSegments; i++) {
        const angle = rotation + i * arc;

        // Dibujar el segmento
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + arc);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.fill();

        // Dibujar el texto del segmento
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle + arc / 2);
        ctx.fillStyle = "white";
        ctx.font = "bold 18px Arial";
        ctx.fillText(segments[i], canvas.width / 4, 0);
        ctx.restore();
    }
}

// Función para girar la ruleta
function spinWheel() {
    if (spinning || segments.length === 0) return;

    spinning = true;
    const spinDuration = 4000; // Duración del giro en ms
    const randomSpins = Math.random() * 2 + 3; // Entre 3 y 5 vueltas completas
    const finalRotation = randomSpins * 2 * Math.PI;

    const start = performance.now();

    function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / spinDuration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        rotation = finalRotation * easeOut;
        createWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            spinning = false; // Detener el giro
        }
    }

    requestAnimationFrame(animate);
}

// Cargar nombres automáticamente al iniciar
loadNames();

// Asociar el botón de actualización a la función createWheel
updateButton.addEventListener("click", createWheel);

// Asociar el botón de girar a la función spinWheel
spinButton.addEventListener("click", spinWheel);
