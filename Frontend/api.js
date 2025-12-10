import { gameConstants } from './gameLogic';

const API_BASE_URL = gameConstants.API_BASE_URL;

export async function saveGameResult(player1, player2, mode, winner, moves, boardState) {
  try {
    const gameData = {
      player1,
      player2,
      mode,
      winner,
      totalMoves: moves.length,
      boardState
    };

    const response = await fetch(${API_BASE_URL}/games, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData)
    });

    const data = await response.json();
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export async function fetchAllGames() {
  try {
    const response = await fetch(${API_BASE_URL}/games);
    
    if (!response.ok) {
      throw new Error(HTTP error! status: ${response.status});
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}