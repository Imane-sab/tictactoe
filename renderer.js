/**
 * Moteur du Jeu Tic-Tac-Toe
 * Gère la logique, l'IA, la victoire et l'affichage.
 */

let board = [];
let size = 3; // Par défaut
let currentPlayer = "X";
let gameActive = true;

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const gridSelector = document.getElementById('grid-size');
const modeSelector = document.getElementById('game-mode');

// --- 1. Initialisation ---
function initGame() {
    size = parseInt(gridSelector.value);
    board = Array(size * size).fill(null);
    currentPlayer = "X";
    gameActive = true;
    statusElement.textContent = "C'est au tour de X";
    renderBoard();
}

// --- 2. Moteur d'affichage ---
function renderBoard() {
    boardElement.className = `grid-${size}`;
    boardElement.innerHTML = '';

    board.forEach((val, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (val) cell.classList.add(val.toLowerCase()); // Ajoute 'x' ou 'o' pour le style CSS
        cell.textContent = val;
        
        cell.onclick = () => handleMove(index);
        boardElement.appendChild(cell);
    });
}

// --- 3. Logique de jeu ---
function handleMove(index) {
    if (board[index] !== null || !gameActive) return;

    board[index] = currentPlayer;
    renderBoard();

    if (checkWin()) {
        gameActive = false;
        showModal(`🎉 Victoire de ${currentPlayer} ! 🎉`); // Affiche la modale de victoire
        return;
    }

    if (!board.includes(null)) {
        gameActive = false;
        showModal("Match nul !"); // Affiche la modale de match nul
        return;
    }

    // Bascule de tour
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.textContent = `Au tour de ${currentPlayer}`;

    // Tour de l'ordinateur si mode PvE activé
    if (currentPlayer === "O" && modeSelector.value === 'pve') {
        setTimeout(computerMove, 500);
    }
}
// --- 4. IA Basique ---
function computerMove() {
    if (!gameActive) return;

    // 20% de chance de jouer un coup aléatoire (IA moins "robotique")
    if (Math.random() < 0.3) {
        console.log("L'IA fait une petite erreur...");
        let empty = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
        let move = empty[Math.floor(Math.random() * empty.length)];
        handleMove(move);
        return; // On arrête là pour ce tour
    }

    let bestScore = -Infinity;
    let move;
    
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = 'O'; // L'IA simule son coup
            let score = minimax(board, 0, false);
            board[i] = null; // Annule le coup
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    handleMove(move);
}

// On ajoute une limite de profondeur (ex: 6 coups à l'avance)
function minimax(board, depth, isMaximizing, maxDepth = 2) {
    if (checkWinFor('O')) return 10 - depth;
    if (checkWinFor('X')) return depth - 10;
    if (!board.includes(null) || depth >= maxDepth) return 0; // Ajout de la limite

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                bestScore = Math.max(bestScore, minimax(board, depth + 1, false, maxDepth));
                board[i] = null;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                bestScore = Math.min(bestScore, minimax(board, depth + 1, true, maxDepth));
                board[i] = null;
            }
        }
        return bestScore;
    }
}
// Fonction utilitaire pour le Minimax
function checkWinFor(player) {
    const lines = [...Array(size).keys()].map(i => Array.from({length: size}, (_, j) => i * size + j))
        .concat([...Array(size).keys()].map(i => Array.from({length: size}, (_, j) => j * size + i)))
        .concat([Array.from({length: size}, (_, i) => i * (size + 1)), Array.from({length: size}, (_, i) => (i + 1) * (size - 1))]);
    return lines.some(line => line.every(i => board[i] === player));
}

function findBestMove(player) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = player;
            if (checkWin()) {
                board[i] = null; // Reset
                return i;
            }
            board[i] = null; // Reset
        }
    }
    return null;
}

function getRandomMove() {
    let empty = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
    return empty[Math.floor(Math.random() * empty.length)];
}
// --- 5. Vérification de Victoire Dynamique ---
function checkWin() {
    const lines = [];

    // Lignes
    for (let i = 0; i < size; i++) {
        lines.push(Array.from({length: size}, (_, j) => i * size + j));
    }
    // Colonnes
    for (let i = 0; i < size; i++) {
        lines.push(Array.from({length: size}, (_, j) => j * size + i));
    }
    // Diagonales
    lines.push(Array.from({length: size}, (_, i) => i * size + i));
    lines.push(Array.from({length: size}, (_, i) => i * size + (size - 1 - i)));

    return lines.some(line => {
        return line.every(index => board[index] === currentPlayer);
    });
}

// --- Écouteurs d'événements ---
gridSelector.onchange = initGame;
modeSelector.onchange = initGame;

// Lancement
initGame();

// --- Fonctions Modales ---
function showModal(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('victory-modal').style.display = 'flex'; // Affiche la modale
}

function hideModal() {
    document.getElementById('victory-modal').style.display = 'none'; // Cache la modale
}