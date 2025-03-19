const millisecond = 1;
const second = 1000 * millisecond;

window.addEventListener("beforeunload", saveScores);
window.addEventListener("load", () => {
    addListeners();
    retrieveScores();
    displayScores();
});

const listenerConfig = [
    [() => playRound(1), [["click", "rock"], ["keyup", "Digit1"]]],
    [() => playRound(2), [["click", "paper"], ["keyup", "Digit2"]]],
    [() => playRound(3), [["click", "scissors"], ["keyup", "Digit3"]]]
];

function addListeners() {
    listenerConfig.forEach(config => {
        const func = config[0];
        const listeners = config[1];
        listeners.forEach(listener => {
            addListener(listener, func);
        });
    }); 
}

function addListener(listener, func) {
    const eventType = listener[0];
    if (eventType === "click") {
        const id = listener[1];
        const element = document.getElementById(id);
        element.addEventListener(eventType, func);
    } else if (eventType === "keyup") {
        const eventCode = listener[1];
        document.addEventListener(eventType, event => {
            if (event.code === eventCode) func();
        });
    }
}

let scores;
const defaultScores = {
    "player": 0,
    "computer": 0
};

function retrieveScores() {
    const storedScores = localStorage.getItem("scores");
    if (!storedScores) {
        scores = structuredClone(defaultScores);
    } else {
        scores = JSON.parse(storedScores);
    }
}

function saveScores() {
    localStorage.setItem("scores", JSON.stringify(scores));
}

const computer = document.getElementById("computer");
const player = document.getElementById("player");
let roundIsOngoing = false;

function playRound(playerMove) {
    if (roundIsOngoing) return;
    roundIsOngoing = true;
    const computerMove = Math.floor(Math.random() * 3) + 1;
    evaluateWinner(playerMove, computerMove);
    saveScores();
    highlightPlayerMove(playerMove);
    displayMoves(playerMove, computerMove);
    setTimeout(() => {
        changeStateColor("idle");
        highlightPlayerMove(playerMove);
        displayScores();
    }, 1 * second);
    setTimeout(() => {
        roundIsOngoing = false;
    }, 2 * second);
}

function evaluateWinner(playerMove, computerMove) {
    if (playerMove === computerMove) {
        changeStateColor("draw");
        return;
    }
    const playerWinConditions = [
        playerMove === 1 && computerMove === 3,
        playerMove === 2 && computerMove === 1,
        playerMove === 3 && computerMove === 2
    ];
    if (playerWinConditions.includes(true)) {
        changeStateColor("win");
        scores.player++;
    } else {
        changeStateColor("lose");
        scores.computer++;
    }
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

function displayFade(playerSide, computerSide) {
    player.classList.toggle("fade-out");
    computer.classList.toggle("fade-out");
    setTimeout(() => {
        player.innerHTML = playerSide;
        computer.innerHTML = computerSide;
        player.classList.toggle("fade-out");
        computer.classList.toggle("fade-out");
    }, 100 * millisecond);
}