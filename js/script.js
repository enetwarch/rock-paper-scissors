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
    }
    if (eventType === "keyup") {
        const eventCode = listener[1];
        document.addEventListener(eventType, event => {
            if (event.code === eventCode) func();
        })
    }
}

let scores;
const defaultScores = {
    "player": 0,
    "computer": 0
};

function retrieveScores() {
    const storedScores = localStorage.getItem("scores");
    if (storedScores === null || storedScores === undefined) {
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
    displayMoves(playerMove, computerMove);
    setTimeout(displayScores, 1000);
    setTimeout(() => {
        roundIsOngoing = false;
    }, 2000);
}

function evaluateWinner(playerMove, computerMove) {
    if (playerMove === computerMove) return;
    const playerWinConditions = [
        playerMove === 1 && computerMove === 3,
        playerMove === 2 && computerMove === 1,
        playerMove === 3 && computerMove === 2
    ];
    if (playerWinConditions.includes(true)) {
        scores.player++;
    } else {
        scores.computer++;
    }
}

function displayMoves(playerMove, computerMove) {
    const playerMoveIcon = getMoveIcon(playerMove);
    const computerMoveIcon = getMoveIcon(computerMove);
    displayFade(playerMoveIcon, computerMoveIcon);
}

function getMoveIcon(move) {
    switch (move) {
        case 1: return `<i class="fa-solid fa-hand-back-fist"></i>`;
        case 2: return `<i class="fa-solid fa-hand"></i>`;
        case 3: return `<i class="fa-solid fa-hand-scissors"></i>`;
    }
}

function displayScores() {
    const playerScore = scores.player;
    const computerScore = scores.computer;
    displayFade(playerScore, computerScore);
}

function displayFade(playerSide, computerSide) {
    player.classList.add("fade-out");
    computer.classList.add("fade-out");
    setTimeout(() => {
        player.innerHTML = playerSide;
        computer.innerHTML = computerSide;
        player.classList.remove("fade-out");
        computer.classList.remove("fade-out");
        player.classList.add("fade-in");
        computer.classList.add("fade-in"); 
    }, 100);
}