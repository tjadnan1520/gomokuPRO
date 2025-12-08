import React from 'react';

export default function RulesPage({ onBack }) {
  return (
    <section className="rules-page">
      <div className="back-btn-group">
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>
      
      <h2>Game Rules - Gomoku</h2>
      
      <div className="rules-content">
        <div className="rule-section">
          <h3>What is Gomoku?</h3>
          <p>
            Gomoku is a classic two-player board game where the objective is to be the first player 
            to connect five stones in a row. The game is played on a 10x10 grid board.
          </p>
        </div>
        
        <div className="rule-section">
          <h3>Objective</h3>
          <p>
            Create a line of exactly 5 or more of your stones in any direction:
          </p>
          <ul>
            <li><strong>Horizontal:</strong> Five stones in a row from left to right</li>
            <li><strong>Vertical:</strong> Five stones in a row from top to bottom</li>
            <li><strong>Diagonal:</strong> Five stones in a row diagonally</li>
            <li><strong>Anti-diagonal:</strong> Five stones in a row in opposite diagonal</li>
          </ul>
        </div>
        
        <div className="rule-section">
          <h3>Basic Rules</h3>
          <ol>
            <li><strong>Board:</strong> The game is played on a 10x10 board with 100 empty cells</li>
            <li><strong>Players:</strong> Two players take turns placing stones on the board</li>
            <li><strong>Color:</strong> One player uses Black (●) stones, the other uses White (○) stones</li>
            <li><strong>First Move:</strong> Black player always goes first</li>
            <li><strong>Placement:</strong> Players can only place stones on empty cells</li>
            <li><strong>Win Condition:</strong> First player to form a line of 5+ stones wins</li>
            <li><strong>Draw:</strong> If the board fills with no winner, the game is a draw</li>
          </ol>
        </div>
        
        <div className="rule-section">
          <h3>Game Modes</h3>
          <div className="mode-description">
            <h4>Human vs Human</h4>
            <p>Two players take turns playing on the same device. Perfect for local matches!</p>
          </div>
          <div className="mode-description">
            <h4>Human vs AI</h4>
            <p>
              Play against the computer with adjustable difficulty levels:
            </p>
            <ul>
              <li><strong>Easy:</strong> AI looks 3 moves ahead</li>
              <li><strong>Medium:</strong> AI looks 5 moves ahead (default)</li>
              <li><strong>Hard:</strong> AI looks 7 moves ahead</li>
            </ul>
          </div>
        </div>
        
        <div className="rule-section">
          <h3>Strategy Tips</h3>
          <ul>
            <li><strong>Control the Center:</strong> Stones placed near the center are more flexible</li>
            <li><strong>Create Threats:</strong> Build multiple threats that opponent can't block all of them</li>
            <li><strong>Block Opponent:</strong> Don't forget to block opponent's winning moves</li>
            <li><strong>Think Ahead:</strong> Plan multiple moves in advance</li>
            <li><strong>Patterns:</strong> Watch for open-ended patterns (patterns that can be extended on both sides)</li>
          </ul>
        </div>
        
        <div className="rule-section">
          <h3>Scoring & Tracking</h3>
          <p>
            The game tracks all your matches in the scoreboard, showing:
          </p>
          <ul>
            <li>Number of moves in each game</li>
            <li>Winner of each match</li>
            <li>Game type (Human vs Human or Human vs AI)</li>
            <li>Player names and statistics</li>
          </ul>
        </div>
        
        <div className="rule-section">
          <h3>Winning</h3>
          <p>
            When you win, all 5 consecutive stones will be highlighted in green, showing your winning line clearly.
            The game will announce the winner and save the result to your statistics.
          </p>
        </div>
      </div>
    </section>
  );
}