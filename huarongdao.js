// Configuration for the initial state of the board
const initialState = [
    [{ id: 1, name: "Q" }, { id: 2, name: "S3" }, { id: 3, name: "AWS" }],
    [{ id: 4, name: "Game" }, { id: 5, name: "Cloud" }, { id: 6, name: "Lambda" }],
    [{ id: 7, name: "Amplify" }, { id: 8, name: "DynamoDB" }, null], // Null represents the empty space
];

let board = JSON.parse(JSON.stringify(initialState));
const boardElement = document.getElementById('board');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('resetButton');
let timerInterval = null;
let timeElapsed = 0;

// Render the board
function renderBoard() {
    boardElement.innerHTML = ''; // Clear the board
    board.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            const tileElement = document.createElement('div');
            if (tile === null) {
                tileElement.className = 'empty'; // Apply the empty tile class
            } else {
                tileElement.className = 'tile'; // Apply tile styling
                tileElement.innerHTML = `<div class="name">${tile.name}</div><div class="number">${tile.id}</div>`;
                tileElement.addEventListener('click', () => moveTile(rowIndex, colIndex));
            }
            boardElement.appendChild(tileElement); // Add tile to the board
        });
    });
}


// Move a tile if it's adjacent to the empty space
function moveTile(row, col) {
    const [emptyRow, emptyCol] = findEmptyTile();
    if (Math.abs(emptyRow - row) + Math.abs(emptyCol - col) === 1) {
        // Swap the clicked tile with the empty space
        board[emptyRow][emptyCol] = board[row][col];
        board[row][col] = null;
        renderBoard();

        // Use a slight delay to ensure the DOM updates before checking win
        setTimeout(() => {
            if (checkWin()) {
                clearInterval(timerInterval);
                alert(`You win! Time taken: ${timeElapsed}s`);
            }
        }, 50);
    }
}


// Find the empty tile's position
function findEmptyTile() {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === null) return [row, col];
        }
    }
    return [-1, -1];
}

// Check if the player has won
function checkWin() {
    let count = 1;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (row === 2 && col === 2) return true; // Last tile should be empty
            if (board[row][col]?.id !== count++) return false;
        }
    }
    return true;
}

// Check if the board is solvable
function isSolvable(board) {
    const flatBoard = board.flat().filter(tile => tile !== null); // Flatten and remove null
    let inversions = 0;

    for (let i = 0; i < flatBoard.length - 1; i++) {
        for (let j = i + 1; j < flatBoard.length; j++) {
            if (flatBoard[i].id > flatBoard[j].id) inversions++;
        }
    }

    // Solvable if inversions are even
    return inversions % 2 === 0;
}

// Shuffle the board to start the game
function shuffleBoard() {
    do {
        for (let i = 0; i < 1000; i++) {
            const [emptyRow, emptyCol] = findEmptyTile();
            const directions = [
                [0, 1], [0, -1], [1, 0], [-1, 0],
            ]; // Right, Left, Down, Up
            const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
            const newRow = emptyRow + dx;
            const newCol = emptyCol + dy;
            if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
                board[emptyRow][emptyCol] = board[newRow][newCol];
                board[newRow][newCol] = null;
            }
        }
    } while (!isSolvable(board));
    renderBoard();
}

// Start the timer
function startTimer() {
    clearInterval(timerInterval);
    timeElapsed = 0;
    timerElement.textContent = `Time: ${timeElapsed}s`;
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerElement.textContent = `Time: ${timeElapsed}s`;
    }, 1000);
}

// Reset the game
resetButton.addEventListener('click', () => {
    board = JSON.parse(JSON.stringify(initialState));
    shuffleBoard();
    startTimer();
});

// Initialize the game
shuffleBoard();
startTimer();
