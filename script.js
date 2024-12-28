
const cells = document.querySelectorAll("[data-cell]");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset-button");
const opponentSelection = document.getElementById("opponent-selection");
const playerVsPlayerButton = document.getElementById("player-vs-player");
const playerVsAiButton = document.getElementById("player-vs-ai");
const gameInstructions = document.getElementById("game-instructions");
const gameBoard = document.getElementById("game-board");

// Game state variables
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

let currentPlayer = "X";
let gameActive = false;
let vsAI = false;

// Handle cell click
function handleCellClick(e) {
    const cell = e.target;

    if (cell.textContent || !gameActive) return;

    cell.textContent = currentPlayer;
    cell.classList.add(`player-${currentPlayer}`);

    if (checkWin()) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        switchPlayer();
        if (vsAI && currentPlayer === "O") {
            setTimeout(aiMove, 500);
        }
    }
}

// Check for a win
function checkWin() {
    return winningCombinations.some((combination) => {
        if (
            cells[combination[0]].textContent === currentPlayer &&
            cells[combination[1]].textContent === currentPlayer &&
            cells[combination[2]].textContent === currentPlayer
        ) {
            highlightWinningCells(combination);
            return true;
        }
        return false;
    });
}

function highlightWinningCells(combination) {
    combination.forEach((index) => {
        cells[index].classList.add("winning");
    });
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        statusText.textContent = "It's a draw!";
    } else {
        statusText.textContent = `Player ${currentPlayer} wins!`;
    }
}

function isDraw() {
    return [...cells].every((cell) => cell.textContent);
}

function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn.`;
}

function resetGame() {
    gameActive = false;
    currentPlayer = "X";
    cells.forEach((cell) => {
        cell.textContent = "";
        cell.classList.remove("winning", "player-X", "player-O");
    });

    gameBoard.style.display = "none";
    gameInstructions.style.display = "none";

    opponentSelection.style.display = "flex";
    statusText.textContent = "";
}

function aiMove() {
    const availableCells = [...cells].filter((cell) => !cell.textContent);
    if (availableCells.length > 0) {
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        randomCell.textContent = currentPlayer;
        randomCell.classList.add(`player-${currentPlayer}`);

        if (checkWin()) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            switchPlayer();
        }
    }
}

function startGame(playerMode) {
    gameActive = true;
    vsAI = playerMode === "AI";

    opponentSelection.style.display = "none";
    gameInstructions.style.display = "block";
    gameBoard.style.display = "grid";

    statusText.textContent = `Player ${currentPlayer}'s turn.`;
    resetButton.style.display = "block";
}

playerVsPlayerButton.addEventListener("click", () => startGame("PVP"));
playerVsAiButton.addEventListener("click", () => startGame("AI"));

cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
});

resetButton.addEventListener("click", resetGame);

gameBoard.style.display = "none";
gameInstructions.style.display = "none";
statusText.textContent = "";
resetButton.style.display = "none";