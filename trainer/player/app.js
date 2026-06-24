let positions = [];
let filteredPositions = [];

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

    filteredPositions = positions;

    showPosition();
}

function setFilter(player) {

    if (player === "all") {

        filteredPositions = positions;

    } else {

        filteredPositions =
            positions.filter(
                p => p.player === player
            );
    }

    currentIndex = 0;

    showPosition();
}

function showPosition() {

    if (filteredPositions.length === 0) return;

    const position =
        filteredPositions[currentIndex];

    revealed = false;

    revealButton.textContent =
        "🧠 Auflösung zeigen";

    document.getElementById("progressText").textContent =
        `Position ${currentIndex + 1} / ${filteredPositions.length}`;

    const percent =
        ((currentIndex + 1) /
            filteredPositions.length) * 100;

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

    revealed = true;

    solution.classList.remove("hidden");

    revealButton.textContent =
        "➡️ Weiter";
}

function nextPosition() {

    currentIndex++;

    if (
        currentIndex >=
        filteredPositions.length
    ) {

        currentIndex = 0;
    }

    showPosition();
}

revealButton.addEventListener(
    "click",
    function() {

        if (!revealed) {

            revealSolution();

        } else {

            nextPosition();

        }

    }
);

document
    .getElementById("allButton")
    .addEventListener(
        "click",
        () => setFilter("all")
    );

document
    .getElementById("oliButton")
    .addEventListener(
        "click",
        () => setFilter("Oli")
    );

document
    .getElementById("bdButton")
    .addEventListener(
        "click",
        () => setFilter("BD")
    );

loadPositions();
