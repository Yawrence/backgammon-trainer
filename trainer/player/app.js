let positions = [];
let filteredPositions = [];

let currentIndex = 0;
let revealed = false;
let trainingFinished = false;

const positionText = document.getElementById("positionText");
const revealButton = document.getElementById("revealButton");
const solution = document.getElementById("solution");

const defaultPosition = {
    24: { Oli: 2 },
    13: { Oli: 5 },
    8: { Oli: 3 },
    6: { Oli: 5 },

    1: { BD: 2 },
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

function getStartPosition(position) {
    return position.start_position || position.board || defaultPosition;
}

function getPlayedMove(position) {
    if (position.played && position.played.move) {
        return position.played.move;
    }

    return position.played_move;
}

function getBestMove(position) {
    if (position.best && position.best.move) {
        return position.best.move;
    }

    return position.best_move;
}

function parseMoveSteps(moveText) {
    if (!moveText) return [];

    const parts = moveText
        .replaceAll("*", "")
        .split(" ");

    const steps = [];

    for (const part of parts) {
        if (!part.includes("/")) continue;

        const [fromText, toText] = part.split("/");

        if (fromText === "bar") continue;

        const from = Number(fromText);
        const to = Number(toText);

        if (from && to) {
            steps.push({ from, to });
        }
    }

    return steps;
}

function getPlayedSteps(position) {
    if (position.played && position.played.steps) {
        return position.played.steps;
    }

    return parseMoveSteps(getPlayedMove(position));
}

function getBestSteps(position) {
    if (position.best && position.best.steps) {
        return position.best.steps;
    }

    return parseMoveSteps(getBestMove(position));
}

function applyStep(boardPosition, player, step) {
    const newPosition = clonePosition(boardPosition);

    const from = step.from;
    const to = step.to;

    if (!newPosition[from]) newPosition[from] = {};
    if (!newPosition[to]) newPosition[to] = {};

    if (!newPosition[from][player]) {
        return newPosition;
    }

    newPosition[from][player]--;

    if (newPosition[from][player] <= 0) {
        delete newPosition[from][player];
    }

    if (!newPosition[to][player]) {
        newPosition[to][player] = 0;
    }

    newPosition[to][player]++;

    return newPosition;
}

function buildAnimationSequence(startPosition, player, steps) {
    const sequence = [];
    let current = clonePosition(startPosition);

    for (const step of steps) {
        const next = applyStep(current, player, step);

        sequence.push({
            startPosition: current,
            endPosition: next,
            player,
            from: step.from,
            to: step.to
        });

        current = next;
    }

    return {
        sequence,
        finalPosition: current
    };
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
    revealButton.disabled = false;
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
        getStartPosition(position)
    );

    solution.classList.add("hidden");
    solution.innerHTML = "";
}

function revealSolution() {
    if (trainingFinished) return;

    const position = filteredPositions[currentIndex];
    const startPosition = getStartPosition(position);
    const playedSteps = getPlayedSteps(position);
    const playedMove = getPlayedMove(position);

    const animation =
        buildAnimationSequence(
            startPosition,
            position.player,
            playedSteps
        );

    positionText.textContent =
        `🔴 Gespielter Zug: ${playedMove}`;

    revealButton.disabled = true;

    if (animation.sequence.length === 0) {
        window.backgammonBoard.drawPosition(
            animation.finalPosition
        );

        finishReveal(position);
        return;
    }

    window.backgammonBoard.animateMoveSequence(
        animation.sequence,
        function() {
            finishReveal(position);
        }
    );
}

function finishReveal(position) {
    revealed = true;

    const playedMove = getPlayedMove(position);
    const bestMove = getBestMove(position);

    solution.classList.remove("hidden");

    solution.innerHTML = `
        <h3>Auflösung</h3>

        <p class="played">
            🔴 Gespielt: ${playedMove}
        </p>

        <p class="best">
            🟢 GNU: ${bestMove}
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

    revealButton.textContent = "➡️ Weiter";
    revealButton.disabled = false;
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
    revealButton.disabled = false;
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
    .getElementById("oliButton")
    .addEventListener("click", () => setFilter("Oli"));

document
    .getElementById("bdButton")
    .addEventListener("click", () => setFilter("BD"));

loadPositions();
