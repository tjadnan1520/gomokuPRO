import React, { useState } from 'react';

export default function SettingsPanel({ onBack, onStartGame }) {
  const [mode, setMode] = useState('human');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [difficulty, setDifficulty] = useState('medium');

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleStartClick = () => {
    const p1 = player1Name.trim() || 'Player 1';
    const p2 = mode === 'ai' ? 'Computer' : (player2Name.trim() || 'Player 2');
    onStartGame(p1, p2, mode, difficulty);
  };

  return (
    <section className="settings-panel">
      <div className="back-btn-group">
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>
      
      <h2>New Game</h2>
      
      <div className="mode-select">
        <label>Select Game Mode:</label>
        <div className="mode-buttons">
          <button 
            className={`mode-btn ${mode === 'human' ? 'selected' : ''}`}
            onClick={() => handleModeChange('human')}
          >
             Human vs Human
          </button>
          <button 
            className={`mode-btn ${mode === 'ai' ? 'selected' : ''}`}
            onClick={() => handleModeChange('ai')}
          >
             Human vs AI
          </button>
        </div>
      </div>

      <div className="player-inputs">
        <input 
          type="text" 
          placeholder="Your Name (Black)" 
          maxLength="15"
          value={player1Name}
          onChange={(e) => setPlayer1Name(e.target.value)}
        />
        {mode === 'human' ? (
          <input 
            type="text" 
            placeholder="Player 2 Name (White)" 
            maxLength="15"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
          />
        ) : (
          <div className="ai-opponent-display">
            <span>Opponent (White): Computer (AI)</span>
          </div>
        )}
      </div>

      {mode === 'ai' && (
        <div className="difficulty-select">
          <label>Select Difficulty:</label>
          <div className="difficulty-buttons">
            <button 
              className={`difficulty-btn ${difficulty === 'easy' ? 'selected' : ''}`}
              onClick={() => setDifficulty('easy')}
            >
              Easy
            </button>
            <button 
              className={`difficulty-btn ${difficulty === 'medium' ? 'selected' : ''}`}
              onClick={() => setDifficulty('medium')}
            >
              Medium
            </button>
            <button 
              className={`difficulty-btn ${difficulty === 'hard' ? 'selected' : ''}`}
              onClick={() => setDifficulty('hard')}
            >
              Hard
            </button>
          </div>
        </div>
      )}

      <button className="primary-btn" onClick={handleStartClick}>Start Game</button>
    </section>
  );
}
