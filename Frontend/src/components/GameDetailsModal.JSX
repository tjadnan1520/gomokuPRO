import React from 'react';

export default function GameDetailsModal({ game, onClose }) {
  if (!game) return null;

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
          <p><strong>Winner:</strong> {game.winner === 'draw' ? 'Draw' : game.winner}</p>
          <p><strong>Date:</strong> {new Date(game.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}