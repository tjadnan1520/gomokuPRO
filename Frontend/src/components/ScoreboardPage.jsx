import React, { useState, useEffect } from 'react';
import { fetchAllGames } from '../api';

export default function ScoreboardPage({ onBack, onGameDetails }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    setLoading(true);
    const fetchedGames = await fetchAllGames();
    setGames(fetchedGames || []);
    setLoading(false);
  }

  const getWinnerDisplay = (game) => {
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
    <section className="scoreboard-page">
      <div className="back-btn-group">
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>
      
      <h2>Game Scoreboard</h2>
      
      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-label">Total Games</span>
          <span className="stat-value">{games.length}</span>
        </div>
      </div>

      <div className="scoreboard-list">
        {loading ? (
          <p className="no-games">Loading scoreboard...</p>
        ) : games.length === 0 ? (
          <p className="no-games">No games played yet. Start a new game!</p>
        ) : (
          games.map((game, idx) => (
            <div 
              key={idx}
              className="game-record" 
              onClick={() => onGameDetails(game)}
              role="button"
              tabIndex={0}
            >
              <div className="game-record-info">
                <div className="game-record-title">{game.player1} vs {game.player2}</div>
                <div className="game-record-details">
                  {game.mode === 'human' ? '👥 Human vs Human' : '🤖 Human vs AI'} | {game.totalMoves} moves
                </div>
              </div>
              <div className="game-record-winner">
                {getWinnerDisplay(game)}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
