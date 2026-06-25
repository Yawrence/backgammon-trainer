let positions = [];
let filteredPositions = [];

let currentIndex = 0;
let revealed = false;
let trainingFinished = false;

const positionText = document.getElementById("positionText");
const revealButton = document.getElementById("revealButton");
const solution = document.getElementById("solution");

const boardPositions = {
    1: {
        24: { BD: 1 },
        23: { BD: 1 },
        13: { Oli: 5 },
        9: { BD: 1 },
        8: { Oli: 3 },
        6: { Oli: 5 },
        1: { Oli: 2 },
        12: { BD: 5 },
        17: { BD: 3 },
        19: { BD: 4 }
    }
};

const defaultPosition = {
    24: { BD: 2 },
    13: { Oli: 5 },
    8: { Oli: 3 },
    6: { Oli: 5 },
    1: { Oli: 2 },
    12: { BD: 5 },
    17: { BD: 3 },
    19: { BD: 5 }
};

async function loadPositions() {
    const response = await fetch("../../data/training_sets/training_positions.json");

    positions = await response.json();
    filteredPositions = positions;

    showPosition();
}

function clonePosition(position) {
    return JSON.parse(JSON.stringify(position));
}

function getBoardPosition(position) {
    return boardPositions[position.id] || defaultPosition;
}

function applyMove(boardPosition, player, moveText) {
    const newPosition = clonePosition(boardPosition);

    const parts = moveText
        .replaceAll("*", "")
        .split(" ");

    for (const part of parts) {
        if (!part.includes("/")) continue;

        const [fromText, toText] = part.split("/");

        if (fromText === "bar") continue;

        const from = Number(fromText);
        const to = Number(toText);

        if (!from || !to) continue;

        if (!newPosition[from]) {
            newPosition[from] = {};
        }

        if (!newPosition[to]) {
            newPosition[to] = {};
        }

        if (!newPosition[from][player]) {
            continue;
        }

        newPosition[from][player]--;

        if (newPosition[from][player] <= 0) {
            delete newPosition[from][player];
        }

        if (!newPosition[to][player]) {
            newPosition[to][player] = 0;
        }

        newPosition[to][player]++;
    }

    return newPosition;
}

function setFilter(player) {
    filteredPositions =
        player === "all"
            ? positions
            : positions.filter(p => p.player === player);

    currentIndex = 0;
    revealed = false;
    trainingFinished = false;

    showPosition();
}

function showPosition() {
    if (filteredPositions.length === 0) return;

    trainingFinished = false;

    const position = filteredPositions[currentIndex];

    revealed = false;
    revealButton.textContent = "🧠 Auflösung zeigen";

    document.getElementById("progressText").textContent =
        `Position ${currentIndex + 1} / ${filteredPositions.length}`;

    const percent =
        ((currentIndex + 1) / filteredPositions.length) * 100;

    document.getElementById("progressFill").style.width =
        percent + "%";

    positionText.textContent =
        `${position.player} am Zug – Würfel ${position.dice}`;

    window.backgammonBoard.drawPosition(
        getBoardPosition(position)
    );

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
    if (trainingFinished) return;

    const position = filteredPositions[currentIndex];

    const startPosition = getBoardPosition(position);

    const afterPlayedMove = applyMove(
        startPosition,
        position.player,
        position.played_move
    );

    window.backgammonBoard.drawPosition(afterPlayedMove);

    positionText.textContent =
        `Nach gespieltem Zug: ${position.played_move}`;

    revealed = true;
    solution.classList.remove("hidden");
    revealButton.textContent = "➡️ Weiter";
}

function nextPosition() {
    currentIndex++;

    if (currentIndex >= filteredPositions.length) {
        showFinishedScreen();
        return;
    }

    showPosition();
}

function showFinishedScreen() {
    trainingFinished = true;
    revealed = false;

    document.getElementById("progressText").textContent =
        "Training abgeschlossen";

    document.getElementById("progressFill").style.width =
        "100%";

    positionText.textContent =
        "🎉 Training abgeschlossen";

    solution.classList.remove("hidden");

    solution.innerHTML = `
        <h3>🏆 Gut gemacht!</h3>

        <p>
            Du hast ${filteredPositions.length} Positionen bearbeitet.
        </p>

        <p>
            Wähle einen Filter oder starte das Training neu.
        </p>
    `;

    revealButton.textContent = "🔄 Neu starten";
}

function restartTraining() {
    currentIndex = 0;
    revealed = false;
    trainingFinished = false;

    showPosition();
}

revealButton.addEventListener("click", function() {
    if (trainingFinished) {
        restartTraining();
        return;
    }

    if (!revealed) {
        revealSolution();
    } else {
        nextPosition();
    }
});

document
    .getElementById("allButton")
    .addEventListener("click", () => setFilter("all"));

document
    .getElementById
