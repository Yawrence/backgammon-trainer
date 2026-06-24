let positions = [];
let currentIndex = 0;
let revealed = false;

const progress = document.getElementById("progress");
const positionText = document.getElementById("positionText");
const revealButton = document.getElementById("revealButton");
const nextButton = document.getElementById("nextButton");
const solution = document.getElementById("solution");

async function loadPositions() {
    const response = await fetch("../../data/training_sets/training_positions.json");
    positions = await response.json();
    showPosition();
}

function showPosition() {
    const position = positions[currentIndex];
    revealed = false;

    progress.textContent = `Position ${currentIndex + 1} / ${positions.length}`;
    positionText.textContent =
        `${position.player} am Zug – Würfel ${position.dice}`;

    solution.classList.add("hidden");

    solution.innerHTML = `
        <h3>GNU Empfehlung</h3>

        <p class="played">
            Gespielt: ${position.played_move}
        </p>

        <p class="best">
            GNU: ${position.best_move}
        </p>

        <p>
            Fehlerklasse: ${position.severity}
        </p>

        <p>
            Equity-Verlust: ${position.equity_loss}
        </p>

        <p>
            ${position.coach_comment}
        </p>

        <button id="nextButton">Nächste Position</button>
    `;

    document
        .getElementById("nextButton")
        .addEventListener("click", nextPosition);
}

function revealSolution() {
    if (!positions.length) return;
    revealed = true;
    solution.classList.remove("hidden");
}

function nextPosition() {
    currentIndex++;

    if (currentIndex >= positions.length) {
        currentIndex = 0;
    }

    showPosition();
}

revealButton.addEventListener("click", revealSolution);

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" || event.code === "Enter") {
        if (!revealed) {
            revealSolution();
        } else {
            nextPosition();
        }
    }
});

loadPositions();
