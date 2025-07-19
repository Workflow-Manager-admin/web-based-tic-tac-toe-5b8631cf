import React, { useState, useEffect } from 'react';
import './App.css';

/*
 * Color Variables for Tic Tac Toe
 * --accent: #FFC107
 * --primary: #2196F3
 * --secondary: #4CAF50
 */

// PUBLIC_INTERFACE
function App() {
  // Board is represented as an array of 9 cells ('X', 'O', or null)
  const [board, setBoard] = useState(Array(9).fill(null));
  // true: X's turn, false: O's turn
  const [xIsNext, setXIsNext] = useState(true);
  // Track score: { X: number, O: number, Draws: number }
  const [score, setScore] = useState({ X: 0, O: 0, Draws: 0 });
  // Winner: 'X', 'O', 'Draw', or null
  const [winStatus, setWinStatus] = useState(null);

  // Calculate winner or draw after every move
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setWinStatus(winner);
      // Increment score
      setScore((prev) => {
        if (winner === "Draw") return { ...prev, Draws: prev.Draws + 1 };
        return { ...prev, [winner]: prev[winner] + 1 };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    // Do nothing if already has winner or non-empty
    if (winStatus || board[idx]) return;
    const boardCopy = [...board];
    boardCopy[idx] = xIsNext ? "X" : "O";
    setBoard(boardCopy);
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinStatus(null);
  }

  // PUBLIC_INTERFACE
  function resetAll() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinStatus(null);
    setScore({ X: 0, O: 0, Draws: 0 });
  }

  // Get player info for UI
  const currentPlayer = xIsNext ? "X" : "O";
  let announcement = "";
  if (winStatus === "Draw") {
    announcement = "It's a Draw! 🤝";
  } else if (winStatus) {
    announcement = `Player ${winStatus} Wins! 🎉`;
  }

  // For responsive grid
  function getCellStyle(idx) {
    return {
      border: '1.5px solid var(--border-color, #e9ecef)',
      color: board[idx] === "X" ? "#2196F3" : (board[idx] === "O" ? "#4CAF50" : "inherit"),
      fontWeight: 'bold',
      fontSize: 'clamp(2rem, 10vw, 3.3rem)',
      background: 'var(--bg-primary, #fff)',
      transition: 'background 0.2s, color 0.2s',
      aspectRatio: '1 / 1',
      userSelect: 'none',
      cursor: board[idx] || winStatus ? "default" : "pointer",
      outline: (winStatus && getWinningLine(board)?.includes(idx)) ? '2.5px solid #FFC107' : "none"
    };
  }

  return (
    <div className="App ttt-bg" style={{minHeight: "100svh", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #282c34)"}}>
      <div className="ttt-main-container">
        {/* Header */}
        <h1 className="ttt-title" style={{
          fontWeight: 700, fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', letterSpacing: "0.03em", marginBottom: "1.5rem", marginTop: "2.5rem"
        }}>
          Tic Tac Toe
        </h1>
        {/* Player Turn / Notification */}
        <div className="ttt-status" style={{
          marginBottom: "1.2rem", fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', minHeight: '2.2em', display: 'flex', flexDirection: 'column', alignItems: "center"
        }}>
          {winStatus ? (
            <span style={{ color: winStatus === "X" ? "#2196F3" : winStatus === "O" ? "#4CAF50" : "#FFC107", fontWeight: 600 }}>
              {announcement}
            </span>
          ) : (
            <span>
              <span style={{ color: currentPlayer === "X" ? "#2196F3" : "#4CAF50", fontWeight: 600 }}>
                Player {currentPlayer}
              </span>
              {"'s Turn"}
            </span>
          )}
        </div>
        {/* The Game Board */}
        <div className="ttt-board" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(68px, 100px))',
          gridTemplateRows: 'repeat(3, minmax(68px, 100px))',
          gap: "0",
          margin: "0 auto",
          background: "var(--border-color, #e9ecef)",
          borderRadius: ".75rem",
          boxShadow: "0 2px 8px 0 rgba(33, 150, 243, 0.06)",
          width: "min(94vw, 320px)",
          maxWidth: "318px"
        }}>
          {board.map((cell, idx) => (
            <button
              className="ttt-cell"
              key={idx}
              style={getCellStyle(idx)}
              aria-label={`TicTacToe cell ${idx + 1} ${cell ? `(${cell})` : ""}`}
              tabIndex={0}
              onClick={() => handleCellClick(idx)}
              disabled={!!winStatus || !!cell}
            >
              {cell}
            </button>
          ))}
        </div>
        {/* Controls/Score/Reset */}
        <div className="ttt-controls" style={{
          width: "min(98vw, 340px)",
          margin: "0 auto",
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: ".8rem"
        }}>
          {/* Scoreboard */}
          <div className="ttt-scoreboard" style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            gap: ".7em",
            fontSize: "1.15em",
            fontWeight: 500,
            borderRadius: "9px",
            background: "var(--bg-secondary, #f8f9fa)",
            boxShadow: "0 1px 3px rgba(244, 191, 7, 0.07)",
            border: "1.2px solid #e2e2e2",
            padding: "1em .3em"
          }}>
            <span style={{color: "#2196F3"}}>X: {score.X}</span>
            <span style={{color: "#FFC107"}}>Draws: {score.Draws}</span>
            <span style={{color: "#4CAF50"}}>O: {score.O}</span>
          </div>
          {/* Buttons */}
          <div style={{
            display: "flex", width: "100%", justifyContent: "center", gap: "1.2em", marginTop: ".4em"
          }}>
            <button className="ttt-btn" style={controlBtnStyle("#FFC107")}
              onClick={restartGame}
              aria-label="Restart Game"
            >
              Restart
            </button>
            <button className="ttt-btn" style={controlBtnStyle("#2196F3")}
              onClick={resetAll}
              aria-label="Reset All"
            >
              Reset All
            </button>
          </div>
        </div>
        {/* Footer info */}
        <footer style={{
          fontSize: ".96em",
          color: "#bbb",
          marginTop: "2.3rem",
          marginBottom: "2.3rem",
          letterSpacing: ".01em"
        }}>
          Minimalistic React | Kavia.ai
        </footer>
      </div>
      {/* Inline minimal CSS overrides for local theme and responsive for game board */}
      <style>{`
        .ttt-main-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 100svh;
        }
        .ttt-board {
          user-select: none;
        }
        .ttt-cell {
          background: var(--bg-primary, #fff);
          border: none;
          border-right: 1.5px solid var(--border-color, #e9ecef);
          border-bottom: 1.5px solid var(--border-color, #e9ecef);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: inherit;
          font-size: inherit;
          transition: background 0.2s, color 0.2s, outline 0.2s;
          cursor: pointer;
          min-width: 68px;
          min-height: 68px;
        }
        .ttt-cell:nth-child(3n) {
          border-right: none;
        }
        .ttt-cell:nth-child(n+7) {
          border-bottom: none;
        }
        .ttt-cell:active:enabled {
          background: #f6f8fd;
        }
        .ttt-btn {
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 1rem;
          padding: 0.56em 1.15em;
          transition: all 0.17s;
          background: #e8eaf2;
          cursor: pointer;
          box-shadow: 0 0.5px 2px 0 rgba(33, 150, 243, 0.08);
        }
        .ttt-btn:hover, .ttt-btn:focus {
          opacity: 0.87;
          filter: brightness(1.08);
          outline: 2px solid #FFC10722;
        }
        @media (max-width: 500px) {
          .ttt-board {
            width: 98vw;
            max-width: 99vw;
          }
        }
      `}</style>
    </div>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(b) {
  // b = board array of 9 cells
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];
  for (let line of lines) {
    const [a,b1,c] = line;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return b[a]; // 'X' or 'O'
    }
  }
  if (b.every(cell => cell)) return "Draw";
  return null;
}

// Highlight winning line
function getWinningLine(b) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (let line of lines) {
    const [a,b1,c] = line;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return line;
    }
  }
  return null;
}

// Button color style helper
function controlBtnStyle(bg) {
  return {
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: 600,
    fontSize: "1rem",
    padding: "0.46em 1.09em",
    minWidth: "5.5em",
    boxShadow: "0 0.5px 2px 0 rgba(33, 150, 243, 0.08)",
    cursor: "pointer"
  };
}

export default App;
