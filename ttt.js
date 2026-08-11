const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");

let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

// Winning combinations
const winningConditions = [
    [0, 1, 2] [3, 4, 5] [6, 7, 8] 
    [0, 3, 6] [1, 4, 7] [2, 5, 8] 
    [0, 4, 8] [2, 4, 6]
];

// Function to handle cell clicks
function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute("data-index");

    if (gameState[index] !== "" || !gameActive) return;

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWin()) {
        statusText.textContent = Player ${currentPlayer} Wins ;
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = Player ${currentPlayer}'s turn';
}

// Function to check for a win
function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => gameState[index] === currentPlayer);
    });
}

// Function to reset the game
function resetGame() {
    gameState.fill("");
    gameActive = true;
    currentPlayer = "X";
    statusText.textContent = "Player X's turn";
    cells.forEach(cell => (cell.textContent = ""));
}

// Add event listeners
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
