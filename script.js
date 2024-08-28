const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `轮到 ${currentPlayer} 玩家`;
        if (currentPlayer === 'O') {
            setTimeout(aiMove, 500);
        }
    }
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `${currentPlayer} 赢了！`;
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        statusDisplay.textContent = '平局！';
        gameActive = false;
        return;
    }
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        'X': -1,
        'O': 1,
        'tie': 0
    };

    if (checkWin(board, 'O')) return scores['O'];
    if (checkWin(board, 'X')) return scores['X'];
    if (checkDraw(board)) return scores['tie'];

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(board, player) {
    for (let condition of winningConditions) {
        if (condition.every(index => board[index] === player)) {
            return true;
        }
    }
    return false;
}

function checkDraw(board) {
    return !board.includes('');
}

function aiMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';

    checkResult();
    if (gameActive) {
        currentPlayer = 'X';
        statusDisplay.textContent = `轮到 ${currentPlayer} 玩家`;
    }
}

function restartGame() {
    board.fill('');
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
    statusDisplay.textContent = `轮到 ${currentPlayer} 玩家`;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);

statusDisplay.textContent = `轮到 ${currentPlayer} 玩家`;