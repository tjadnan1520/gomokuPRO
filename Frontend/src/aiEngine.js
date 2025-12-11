import { gameConstants, cloneBoard, getCandidateMoves, evaluateBoard, isFull } from './gameLogic';

const DIFFICULTY_DEPTHS = {
  easy: 3,
  medium: 5,
  hard: 7
};

const MAX_MOVES_TO_EXPLORE = {
  easy: 15,
  medium: 12,
  hard: 10
};

export async function getAIMove(board, aiColor, difficulty = 'medium') {
  const maxDepth = DIFFICULTY_DEPTHS[difficulty] || DIFFICULTY_DEPTHS.medium;
  return new Promise(resolve => {
    setTimeout(() => {
      const move = searchWithFixedDepth(board, aiColor, maxDepth, difficulty);
      resolve(move);
    }, 0); 
  });
}

function searchWithFixedDepth(boardState, aiColor, maxDepth, difficulty) {
  let bestMove = null;
  let bestScore = -Infinity;
  const moves = getCandidateMoves(boardState);
  
  const sortedMoves = sortMovesByHeuristic(boardState, moves, aiColor);
  
  const maxMoves = MAX_MOVES_TO_EXPLORE[difficulty] || 12;
  const movesToExplore = sortedMoves.slice(0, maxMoves);
  
  for (const { r, c } of movesToExplore) {
    const newBoard = cloneBoard(boardState);
    newBoard[r][c] = aiColor;
    
    const val = minimaxWithFixedDepth(
      newBoard, 
      maxDepth - 1, 
      false,  
      aiColor, 
      aiColor === 'black' ? 'white' : 'black', 
      -Infinity,  
      Infinity    
    );
    
    if (val > bestScore) {
      bestScore = val;
      bestMove = { r, c };
    }
  }
  return bestMove;
}

function sortMovesByHeuristic(board, moves, aiColor) {
  const opp = aiColor === 'black' ? 'white' : 'black';
  const BOARD_SIZE = 10;
  const directions = [[1,0], [0,1], [1,1], [1,-1]];
  
  const scoredMoves = moves.map(({ r, c }) => {
    let score = 0;
    const testBoard = board.map(row => row.slice());
    
    testBoard[r][c] = aiColor;
    if (isWinningMove(testBoard, r, c, aiColor)) {
      return { r, c, score: 500000 }; 
    }
    
    testBoard[r][c] = opp;
    if (isWinningMove(testBoard, r, c, opp)) {
      score += 400000; 
    }
    testBoard[r][c] = 'empty';
    
    testBoard[r][c] = aiColor;
    for (const [dr, dc] of directions) {
      const threatLevel = evaluateThreatPattern(testBoard, r, c, aiColor, dr, dc);
      score += threatLevel;
    }
    
    testBoard[r][c] = opp;
    for (const [dr, dc] of directions) {
      const blockValue = evaluateThreatPattern(testBoard, r, c, opp, dr, dc);
      score += blockValue * 0.85; 
    }
    testBoard[r][c] = 'empty';
    
    const centerRow = Math.floor(BOARD_SIZE / 2);
    const centerCol = Math.floor(BOARD_SIZE / 2);
    const distFromCenter = Math.abs(r - centerRow) + Math.abs(c - centerCol);
    score += (BOARD_SIZE - distFromCenter) * 50; 
    
    let adjacencyBonus = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
          if (board[nr][nc] === aiColor) adjacencyBonus += 100;
          else if (board[nr][nc] === opp) adjacencyBonus += 80;
        }
      }
    }
    score += adjacencyBonus;
    
    return { r, c, score };
  });

  return scoredMoves.sort((a, b) => b.score - a.score);
}

function evaluateThreatPattern(board, r, c, color, dr, dc) {
  const WIN_LENGTH = 5;
  let count = 1;
  let openSpaces = 0;
  let blocked1 = false;
  let blocked2 = false;
  
  for (let i = 1; i < WIN_LENGTH; i++) {
    const nr = r + dr * i, nc = c + dc * i;
    if (nr < 0 || nr >= 10 || nc < 0 || nc >= 10) {
      blocked1 = true;
      break;
    }
    if (board[nr][nc] === color) count++;
    else if (board[nr][nc] === 'empty') {
      openSpaces++;
      if (openSpaces > 1) break;
    } else {
      blocked1 = true;
      break;
    }
  }
  
  for (let i = 1; i < WIN_LENGTH; i++) {
    const nr = r - dr * i, nc = c - dc * i;
    if (nr < 0 || nr >= 10 || nc < 0 || nc >= 10) {
      blocked2 = true;
      break;
    }
    if (board[nr][nc] === color) count++;
    else if (board[nr][nc] === 'empty') {
      openSpaces++;
      if (openSpaces > 1) break;
    } else {
      blocked2 = true;
      break;
    }
  }

  if (count >= WIN_LENGTH) return 30000;
  
  let threatScore = 0;
  
  if (count === 4) {
    threatScore = !blocked1 || !blocked2 ? 15000 : 10000;
  } else if (count === 3) {
    threatScore = !blocked1 && !blocked2 ? 5000 : 2500;
  } else if (count === 2) {
    threatScore = !blocked1 && !blocked2 ? 800 : 400;
  } else if (count === 1) {
    threatScore = 100;
  }
  
  return threatScore;
}

function isWinningMove(board, r, c, color) {
  const WIN_LENGTH = 5;
  const directions = [[1,0], [0,1], [1,1], [1,-1]];
  
  for (const [dr, dc] of directions) {
    let count = 1;
    
    for (let i = 1; i < WIN_LENGTH; i++) {
      const nr = r + dr * i, nc = c + dc * i;
      if (nr < 0 || nr >= 10 || nc < 0 || nc >= 10) break;
      if (board[nr][nc] === color) count++;
      else break;
    }
    
    for (let i = 1; i < WIN_LENGTH; i++) {
      const nr = r - dr * i, nc = c - dc * i;
      if (nr < 0 || nr >= 10 || nc < 0 || nc >= 10) break;
      if (board[nr][nc] === color) count++;
      else break;
    }
    
    if (count >= WIN_LENGTH) return true;
  }
  
  return false;
}

export function minimaxWithFixedDepth(boardState, depth, maximizing, aiColor, currColor, alpha, beta) {

  const winner = getWinnerForAI(boardState);
  if (winner === aiColor) return 1000000;              
  if (winner && winner !== aiColor) return -1000000;  
  if (isFull(boardState)) return 0;                   
  if (depth === 0) return evaluateBoard(boardState, aiColor);  
  
  const moves = getCandidateMoves(boardState);
  
  const maxMovesToExplore = depth === 1 ? 20 : depth === 2 ? 12 : 8;
  const sortedMoves = sortMovesByHeuristic(boardState, moves, aiColor).slice(0, maxMovesToExplore);
  
  if (maximizing) {
    let value = -Infinity;
    
    for (const { r, c } of sortedMoves) {
      const newBoard = cloneBoard(boardState);
      newBoard[r][c] = currColor;

      value = Math.max(
        value, 
        minimaxWithFixedDepth(
          newBoard, 
          depth - 1, 
          false,  
          aiColor, 
          currColor === 'black' ? 'white' : 'black', 
          alpha, 
          beta
        )
      );
      
      alpha = Math.max(alpha, value);
      
      if (alpha >= beta) {
        break;  
      }
      
    }
    
    return value;
  } 

  else {
    let value = Infinity;
    
    for (const { r, c } of sortedMoves) {
      const newBoard = cloneBoard(boardState);
      newBoard[r][c] = currColor;
      
      value = Math.min(
        value, 
        minimaxWithFixedDepth(
          newBoard, 
          depth - 1, 
          true,  
          aiColor, 
          currColor === 'black' ? 'white' : 'black', 
          alpha, 
          beta
        )
      );
      
      beta = Math.min(beta, value);
      
      if (alpha >= beta) {
        break;  
      }
    }
    
    return value;
  }
}

function getWinnerForAI(board) {
  const BOARD_SIZE = gameConstants.BOARD_SIZE;
  const WIN_LENGTH = gameConstants.WIN_LENGTH;
  
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 'empty') continue;
      if (
        checkLineForAI(board, r, c, 1, 0) ||
        checkLineForAI(board, r, c, 0, 1) ||
        checkLineForAI(board, r, c, 1, 1) ||
        checkLineForAI(board, r, c, 1, -1)
      ) return board[r][c];
    }
  }
  return null;
}

function checkLineForAI(board, r, c, dr, dc) {
  const BOARD_SIZE = gameConstants.BOARD_SIZE;
  const WIN_LENGTH = gameConstants.WIN_LENGTH;
  const color = board[r][c];
  for (let i = 1; i < WIN_LENGTH; i++) {
    const nr = r + dr * i, nc = c + dc * i;
    if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) return false;
    if (board[nr][nc] !== color) return false;
  }
  return true;
}
