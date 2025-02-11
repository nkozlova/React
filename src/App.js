import './App.css';
import { useState } from 'react';


function Square({ value, onSquareClick }) {
    return <button className="square" onClick={onSquareClick}>{value ? value : '\xa0'}</button>; // Non-breakable space 0xa0
}

function Board({ order, squares, onPlay }) {
    function handleClick(index) {
        if (squares[index] || winner) {
            return;
        }

        const nextSquares = squares.slice();
        nextSquares[index] = order ? 'X' : 'O';
        onPlay(nextSquares);
    }

    let status;
    const winner = CalculateWinner(squares);
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = "Step: " + (order ? "X" : "O");
    }

    return (
        <>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>

            <div className="status">{status}</div>
        </>
    );
}

function CalculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
            return squares[a]; // winner
        }
    }

    return null;
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function goToStep(step) {
        setCurrentMove(step);
    }

    const steps = history.map((_, step) => {
        let description;
        if (step == 0) {
            description = "Go to start";
        } else {
            description = "Go to step " + step;
        }

        return (
            <li key={step}>
                <button onClick={() => goToStep(step)}>{description}</button>
            </li>
        );
    });

    return (
        <div>
            <div className="board">
                <Board order={currentMove % 2 === 0} squares={history[currentMove]} onPlay={handlePlay}/>
            </div>
            <div className="game-info">
                <ol>{steps}</ol>
            </div>
        </div>
    );
}
