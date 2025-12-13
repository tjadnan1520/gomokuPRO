import React from 'react';

export default function GameDetailsModal({ game, onClose }) {
  if (!game) return null;

  const getWinnerDisplay = () => {
    if (game.winner === 'draw') {
      return 'Draw';
    }
    // If winner is 'black' or 'white', convert to player name
    if (game.winner === 'black') {
      return game.player1;
    }
    if (game.winner === 'white') {
      return game.player2;
    }
    // Otherwise, winner is already the player name
    return game.winner;
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h3>Game Details</h3>
        <div className="modal-body">
          <p><strong>Player 1:</strong> {game.player1}</p>
          <p><strong>Player 2:</strong> {game.player2}</p>
          <p><strong>Game Mode:</strong> {game.mode === 'human' ? 'Human vs Human' : 'Human vs AI'}</p>
          <p><strong>Total Moves:</strong> {game.totalMoves}</p>
          <p><strong>Winner:</strong> {getWinnerDisplay()}</p>
          <p><strong>Date:</strong> {new Date(game.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
