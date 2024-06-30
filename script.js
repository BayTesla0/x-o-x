document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const playerScoreElement = document.getElementById('player-score');
    const botScoreElement = document.getElementById('bot-score');
    const difficultySelect = document.getElementById('difficulty');
    let playerScore = 0;
    let botScore = 0;
    let board = Array(9).fill(null);
    let currentPlayer = 'X';
    let difficulty = 'easy';

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function checkWinner() {
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return board.includes(null) ? null : 'draw';
    }
    

    function botMove() {
        let move;
        if (difficulty === 'easy') {
            move = easyBotMove();
        } else if (difficulty === 'hard') {
            move = hardBotMove();
        } else {
            move = impossibleBotMove();
        }
        if (move !== null) {
            board[move] = 'O';
            cells[move].classList.add('o');
            cells[move].innerHTML = 'O';
            const winner = checkWinner();
            if (winner) {
                endGame(winner);
            } else {
                currentPlayer = 'X';
            }
        }
    }

    function easyBotMove() {
        const emptyCells = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    function impossibleBotMove() {
        function minimax(newBoard, player) {
            const emptyCells = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
            const winner = checkWinner();
    
            if (winner === 'X') {
                return { score: -10 };
            } else if (winner === 'O') {
                return { score: 10 };
            } else if (emptyCells.length === 0) {
                return { score: 0 };
            }
    
            const moves = [];
    
            for (let i = 0; i < emptyCells.length; i++) {
                const move = {};
                move.index = emptyCells[i];
                newBoard[emptyCells[i]] = player;
    
                if (player === 'O') {
                    const result = minimax(newBoard, 'X');
                    move.score = result.score;
                } else {
                    const result = minimax(newBoard, 'O');
                    move.score = result.score;
                }
    
                newBoard[emptyCells[i]] = null;
                moves.push(move);
            }
    
            let bestMove;
            if (player === 'O') {
                let bestScore = -Infinity;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score > bestScore) {
                        bestScore = moves[i].score;
                        bestMove = moves[i];
                    }
                }
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = moves[i];
                    }
                }
            }
    
            return bestMove;
        }
    
        const bestMove = minimax(board, 'O');
        return bestMove.index;
    }
    
    function hardBotMove() {
        // Kazanma veya engelleme hamlesini kontrol et
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                // Botun kazanma hamlesini kontrol et
                board[i] = 'O';
                if (checkWinner() === 'O') {
                    return i;
                }
                board[i] = null;
    
                // Kullanıcının kazanma hamlesini engelle
                board[i] = 'X';
                if (checkWinner() === 'X') {
                    board[i] = null;
                    return i;
                }
                board[i] = null;
            }
        }
    
        // Ortadaki hücre boşsa seç
        if (board[4] === null) {
            return 4;
        }
    
        // Kolay bot hamlesi yap
        return easyBotMove();
    }
    
    function endGame(winner) {
        if (winner === 'X') {
            message.textContent = 'Kazandın!';
            playerScore++;
            playerScoreElement.textContent = playerScore;
        } else if (winner === 'O') {
            message.textContent = 'Kaybettin!';
            botScore++;
            botScoreElement.textContent = botScore;
        } else {
            message.textContent = 'Berabere!';
        }
        board = Array(9).fill(null);
        cells.forEach(cell => {
            cell.classList.remove('x', 'o');
            cell.innerHTML = '';
        });
        currentPlayer = 'X';
    }

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = cell.getAttribute('data-index');
            if (board[index] || checkWinner()) {
                return;
            }
            board[index] = currentPlayer;
            cell.classList.add('x');
            cell.innerHTML = 'X';
            const winner = checkWinner();
            if (winner) {
                endGame(winner);
            } else {
                currentPlayer = 'O';
                botMove();
            }
        });
    });

    difficultySelect.addEventListener('change', () => {
        difficulty = difficultySelect.value;
    });
});
