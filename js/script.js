let scores = {};
const defaultScores = {
    "player": 0,
    "computer": 0
};

window.addEventListener("load", () => {
    const storedScores = localStorage.getItem("scores");
    if (!storedScores) {
        scores = structuredClone(defaultScores);
    } else {
        scores = JSON.parse(storedScores);
    }

    displayScores();
});

const rockElement = document.getElementById("rock");
const paperElement = document.getElementById("paper");
const scissorsElement = document.getElementById("scissors");

const ROCK = 1, PAPER = 2, SCISSORS = 3;

rockElement.addEventListener("click", () => playRound(ROCK));
document.addEventListener("keyup", event => {
    if (event.code === "Digit1") playRound(ROCK);
});

paperElement.addEventListener("click", () => playRound(PAPER));
document.addEventListener("keyup", event => {
    if (event.code === "Digit2") playRound(PAPER);
})

scissorsElement.addEventListener("click", () => playRound(SCISSORS));
document.addEventListener("keyup", event => {
    if (event.code === "Digit3") playRound(SCISSORS);
})

let roundIsOngoing = false;

function playRound(playerMove) {
    if (roundIsOngoing) return;
    roundIsOngoing = true;

    const computerMove = Math.floor(Math.random() * 3) + 1;
    evaluateWinner(playerMove, computerMove);

    localStorage.setItem("scores", JSON.stringify(scores));

    displayMoves(playerMove, computerMove);
    highlightPlayerMove(playerMove);

    setTimeout(() => {
        changeStateColor("idle");
        highlightPlayerMove(playerMove);
        displayScores();
    }, 1000);

    setTimeout(() => {
        roundIsOngoing = false;
    }, 2000);
}

function evaluateWinner(playerMove, computerMove) {
    if (playerMove === computerMove) {
        changeStateColor("draw");
        return;
    } else if (isPlayerWinner(playerMove, computerMove)) {
        changeStateColor("win");
        scores.player++;
    } else {
        changeStateColor("lose");
        scores.computer++;
    }
}

function isPlayerWinner(playerMove, computerMove) {
    return (
        (playerMove === 1 && computerMove === 3) ||
        (playerMove === 2 && computerMove === 1) ||
        (playerMove === 3 && computerMove === 2)
    );
}

const stateColors = {
    "idle": "--dark-1",
    "draw": "--green",
    "win": "--blue",
    "lose": "--red"
};

const moveElements = {
    1: document.getElementById("rock"),
    2: document.getElementById("paper"),
    3: document.getElementById("scissors")
};

const moveIcons = {
    1: `<i class="fa-solid fa-hand-back-fist"></i>`,
    2: `<i class="fa-solid fa-hand"></i>`,
    3: `<i class="fa-solid fa-hand-scissors"></i>`
};

function changeStateColor(state) {
    const root = getComputedStyle(document.documentElement);
    const stateColor = root.getPropertyValue(stateColors[state]);

    document.body.style.backgroundColor = stateColor;
}

function highlightPlayerMove(playerMove) {
    const playerMoveElement = moveElements[playerMove];
    playerMoveElement.classList.toggle("inverted");
}

function displayMoves(playerMove, computerMove) {
    const playerMoveIcon = moveIcons[playerMove];
    const computerMoveIcon = moveIcons[computerMove];

    displayFade(playerMoveIcon, computerMoveIcon);
}

function displayScores() {
    const playerScore = scores.player;
    const computerScore = scores.computer;

    displayFade(playerScore, computerScore);
}

const computerElement = document.getElementById("computer");
const playerElement = document.getElementById("player");

function displayFade(playerSide, computerSide) {
    playerElement.classList.toggle("fade-out");
    computerElement.classList.toggle("fade-out");

    setTimeout(() => {
        playerElement.innerHTML = playerSide;
        computerElement.innerHTML = computerSide;

        playerElement.classList.toggle("fade-out");
        computerElement.classList.toggle("fade-out");
    }, 100);
}