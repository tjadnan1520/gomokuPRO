import React from 'react';
import Board from './Board';

export default function GamePanel({ 
  board, 
  currentPlayer, 
  playerNames, 
  gameMessage, 
  winningCells,
  onCellClick, 
  onRestart, 
  onHome
}) {
  const stone = currentPlayer === 'black' ? '●' : '○';
  const displayText = `${playerNames[currentPlayer]}'s Turn ${stone}`;

  return (
    <section className="game-panel">
      <div className="game-header">
        <button className="back-btn" onClick={onHome}>← Home</button>
        <h2>gomokuPRO</h2>
        <div className="spacer"></div>
      </div>
      
      <div className="game-content">
        <div className="game-info">
          <div className="player-info player-black">
            <span>{playerNames.black}</span>
            <span className="stone black-stone">●</span>
          </div>
          <span className="turn-indicator">{displayText}</span>
          <div className="player-info player-white">
            <span className="stone white-stone">○</span>
            <span>{playerNames.white}</span>
          </div>
        </div>
        
        <Board 
          board={board} 
          onCellClick={onCellClick}
          winningCells={winningCells}
        />
        
        <div className="game-message">{gameMessage}</div>
        
        <button className="primary-btn" onClick={onRestart} disabled={!gameMessage}>
          Restart Game
        </button>
      </div>
    </section>
  );
}
