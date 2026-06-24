let positions = [];
let currentIndex = 0;
let revealed = false;

const positionText =
    document.getElementById("positionText");

const revealButton =
    document.getElementById("revealButton");

const solution =
    document.getElementById("solution");

async function loadPositions() {

    const response = await fetch(
        "../../data/training_sets/training_positions.json"
    );

    positions = await response.json();

    showPosition();
}

function showPosition() {

    const position = positions[currentIndex];

    revealed = false;

    revealButton.textContent =
        "🧠 Auflösung zeigen";

    document.getElementById("progressText").textContent =
        `Position ${currentIndex + 1} / ${positions.length}`;

    const percent =
        ((currentIndex + 1) / positions.length) * 100;

    document.getElementById("progressFill").style.width =
        percent + "%";

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
    `;
}

function revealSolution() {

    if (!positions.length) return;

    revealed = true;

    solution.classList.remove("hidden");

    revealButton.textContent =
        "➡️ Weiter";
}

function nextPosition() {

    currentIndex++;

    if (currentIndex >= positions.length) {
        currentIndex = 0;
    }

    showPosition();
}

revealButton.addEventListener("click", function() {

    if (!revealed) {
        revealSolution();
    } else {
        nextPosition();
    }

});

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
