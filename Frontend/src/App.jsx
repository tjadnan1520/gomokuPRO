import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import SettingsPanel from './components/SettingsPanel';
import GamePanel from './components/GamePanel';
import ScoreboardPage from './components/ScoreboardPage';
import GameDetailsModal from './components/GameDetailsModal';
import { initBoard, checkWin, isDraw, findWinningLine, cloneBoard } from './gameLogic';
import { getAIMove } from './aiEngine';
import { saveGameResult } from './api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [board, setBoard] = useState(initBoard());
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [gameActive, setGameActive] = useState(false);
  const [mode, setMode] = useState('human');
  const [playerNames, setPlayerNames] = useState({ black: 'Player 1', white: 'Player 2' });
  const [gameMessage, setGameMessage] = useState('');
  const [aiSide, setAiSide] = useState(null);
  const [selectedGameDetails, setSelectedGameDetails] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [currentGameData, setCurrentGameData] = useState(null);
  const [scoreboardRefresh, setScoreboardRefresh] = useState(0);
  const [waitingForAI, setWaitingForAI] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState('medium');

  // Handle AI move after board updates
  useEffect(() => {
    if (waitingForAI && gameActive && mode === 'ai' && currentPlayer === 'white') {
      // Let React render the human's move first
      const timer = setTimeout(async () => {
        const aiMove = await getAIMove(board, 'white', aiDifficulty);
        if (aiMove) {
          const newBoard = cloneBoard(board);
          newBoard[aiMove.r][aiMove.c] = 'white';
          
          // Check for AI win
          if (checkWin(newBoard, aiMove.r, aiMove.c, 'white')) {
            const winningLine = findWinningLine(newBoard, aiMove.r, aiMove.c, 'white');
            setWinningCells(winningLine);
            setBoard(newBoard);
            await endGame(`${playerNames.white} wins!`, 'white', newBoard);
            setWaitingForAI(false);
            return;
          }
          
          // Check for draw
          if (isDraw(newBoard)) {
            setBoard(newBoard);
            await endGame('Draw!', 'draw', newBoard);
            setWaitingForAI(false);
            return;
          }
          
          // Update board and switch back to human
          setCurrentGameData(prev => ({
            ...prev,
            moves: [...(prev?.moves || []), { r: aiMove.r, c: aiMove.c, color: 'white' }]
          }));
          setBoard(newBoard);
          setCurrentPlayer('black');
          setWaitingForAI(false);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [waitingForAI, gameActive, mode, currentPlayer, board, playerNames]);

  // Handle cell click
  async function handleCellClick(r, c) {
    if (!gameActive || board[r][c] !== 'empty') return;
    if (waitingForAI) return; // Prevent clicks during AI thinking
    if (mode === 'ai' && currentPlayer !== 'black') return;
    
    const newBoard = cloneBoard(board);
    newBoard[r][c] = currentPlayer;
    
    // Check for win
    if (checkWin(newBoard, r, c, currentPlayer)) {
      const winningLine = findWinningLine(newBoard, r, c, currentPlayer);
      setWinningCells(winningLine);
      setBoard(newBoard);
      await endGame(`${playerNames[currentPlayer]} wins!`, currentPlayer, newBoard);
      return;
    }
    
    // Check for draw
    if (isDraw(newBoard)) {
      setBoard(newBoard);
      await endGame('Draw!', 'draw', newBoard);
      return;
    }
    
    // Update board and game data
    setCurrentGameData(prev => ({
      ...prev,
      moves: [...(prev?.moves || []), { r, c, color: currentPlayer }]
    }));
    setBoard(newBoard);
    
    // Switch player based on game mode
    if (mode === 'human') {
      // Human vs Human: alternate between black and white
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
    } else {
      // Human vs AI: always switch to white for AI to play
      setCurrentPlayer('white');
      setWaitingForAI(true);
    }
  }

  // End game
  async function endGame(msg, winner, finalBoard) {
    setGameActive(false);
    setGameMessage(msg);
    
    if (currentGameData) {
      await saveGameResult(
        playerNames.black,
        playerNames.white,
        mode,
        winner,
        currentGameData.moves,
        finalBoard
      );
      // Trigger scoreboard refresh
      setScoreboardRefresh(prev => prev + 1);
    }
  }

  // Start game
  function handleStartGame(p1, p2, gameMode, difficulty = 'medium') {
    setPlayerNames({ black: p1, white: p2 });
    setMode(gameMode);
    setAiDifficulty(difficulty);
    setAiSide(gameMode === 'ai' ? 'white' : null);
    setBoard(initBoard());
    setCurrentPlayer('black');
    setGameMessage('');
    setWinningCells([]);
    setGameActive(true);
    setCurrentGameData({
      player1: p1,
      player2: p2,
      mode: gameMode,
      moves: [],
      startTime: new Date()
    });
    setCurrentPage('game');
  }

  // Restart game
  function handleRestart() {
    setCurrentPage('settings');
  }

  // Show different pages
  function renderPage() {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onPlayClick={() => setCurrentPage('settings')}
            onScoreboardClick={() => setCurrentPage('scoreboard')}
          />
        );
      case 'settings':
        return (
          <SettingsPanel 
            onBack={() => setCurrentPage('home')}
            onStartGame={handleStartGame}
          />
        );
      case 'game':
        return (
          <GamePanel 
            board={board}
            currentPlayer={currentPlayer}
            playerNames={playerNames}
            gameMessage={gameMessage}
            winningCells={winningCells}
            onCellClick={handleCellClick}
            onRestart={handleRestart}
            onHome={() => setCurrentPage('home')}
          />
        );
      case 'scoreboard':
        return (
          <ScoreboardPage 
            key={scoreboardRefresh}
            onBack={() => setCurrentPage('home')}
            onGameDetails={(game) => setSelectedGameDetails(game)}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="gomoku-container">
      <header>
        <h1>🎮 Gomoku Pro</h1>
        <p className="tagline">Challenge your friends or the AI</p>
      </header>

      {renderPage()}

      {selectedGameDetails && (
        <GameDetailsModal 
          game={selectedGameDetails}
          onClose={() => setSelectedGameDetails(null)}
        />
      )}

      <footer>
        <p>Gomoku Pro &copy; 2025</p>
      </footer>
    </div>
  );
}
