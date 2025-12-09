import React from 'react';

export default function HomePage({ onPlayClick, onScoreboardClick, onRulesClick }) {
  return (
    <section className="home-page">
      <div className="home-content">
        <h2>Welcome to Gomoku Pro</h2>
        <p>Connect 5 stones in a row to win!</p>
        
        <div className="button-group">
          <button className="primary-btn" onClick={onPlayClick}>New Game</button>
          <button className="secondary-btn" onClick={onScoreboardClick}>View Scoreboard</button>
          <button className="secondary-btn" onClick={onRulesClick}>Rules</button>
        </div>
      </div>
    </section>
  );
}
