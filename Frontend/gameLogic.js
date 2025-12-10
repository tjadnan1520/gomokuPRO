const BOARD_SIZE = 10;
const WIN_LENGTH = 5;

export const gameConstants = {
  BOARD_SIZE,
  WIN_LENGTH,
  AI_DEPTH: 3,
  AI_TIME_LIMIT: 1200,
  API_BASE_URL: 'http://localhost:4000/api'
};

export function initBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill('empty'));
}

export function checkWin(board, r, c, color) {
  return (
    countDir(board, r, c, color, 1, 0) + countDir(board, r, c, color, -1, 0) + 1 >= WIN_LENGTH ||
    countDir(board, r, c, color, 0, 1) + countDir(board, r, c, color, 0, -1) + 1 >= WIN_LENGTH ||
    countDir(board, r, c, color, 1, 1) + countDir(board, r, c, color, -1, -1) + 1 >= WIN_LENGTH ||
    countDir(board, r, c, color, 1, -1) + countDir(board, r, c, color, -1, 1) + 1 >= WIN_LENGTH
  );
}

function countDir(board, r, c, color, dr, dc) {
  let cnt = 0;
  for (let i = 1; i < WIN_LENGTH; i++) {
    const nr = r + dr * i, nc = c + dc * i;
    if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break;
    if (board[nr][nc] !== color) break;
    cnt++;
  }
  return cnt;
}

export function isDraw(board) {
  return board.flat().every(cell => cell !== 'empty');
}

export function isFull(b) {
  return b.flat().every(cell => cell !== 'empty');
}

export function getWinner(board) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 'empty') continue;
      if (
        checkLine(board, r, c, 1, 0) ||
        checkLine(board, r, c, 0, 1) ||
        checkLine(board, r, c, 1, 1) ||
        checkLine(board, r, c, 1, -1)
      ) return board[r][c];
    }
  }
  return null;
}

function checkLine(board, r, c, dr, dc) {
  const color = board[r][c];
  for (let i = 1; i < WIN_LENGTH; i++) {
    const nr = r + dr * i, nc = c + dc * i;
    if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) return false;
    if (board[nr][nc] !== color) return false;
  }
  return true;
}

export function cloneBoard(b) {
  return b.map(row => row.slice());
}

export function getCandidateMoves(boardState) {
  const moves = [];
  const seen = new Set();
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (boardState[r][c] !== 'empty') {
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && boardState[nr][nc] === 'empty') {
              const key = nr + ',' + nc;
              if (!seen.has(key)) {
                seen.add(key);
                moves.push({ r: nr, c: nc });
              }
            }
          }
        }
      }
    }
  }
  if (moves.length === 0) {
    const mid = Math.floor(BOARD_SIZE / 2);
    return [{ r: mid, c: mid }];
  }
  return moves;
}

export function evaluateBoard(board, aiColor) {
  const opponent = aiColor === 'black' ? 'white' : 'black';
  let score = 0;
  const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
  
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 'empty') continue;
      
      for (const [dr, dc] of directions) {
        const playerColor = board[r][c];
        let count = 1;
        let openSpaces = 0;
        let blocked1 = false;
        let blocked2 = false;
        
        for (let i = 1; i < WIN_LENGTH; i++) {
          const nr = r + dr * i, nc = c + dc * i;
          if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) {
            blocked1 = true;
            break;
          }
          if (board[nr][nc] === playerColor) count++;
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
          if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) {
            blocked2 = true;
            break;
          }
          if (board[nr][nc] === playerColor) count++;
          else if (board[nr][nc] === 'empty') {
            openSpaces++;
            if (openSpaces > 1) break;
          } else {
            blocked2 = true;
            break;
          }
        }
        
        if (count >= WIN_LENGTH) continue;
        
        let patternScore = 0;
        
        if (count === 4) {
          if (!blocked1 && !blocked2) patternScore = 50000;
          else patternScore = 25000;
        }
        else if (count === 3) {
          if (!blocked1 && !blocked2) patternScore = 10000;
          else patternScore = 5000;
        }
        else if (count === 2) {
          if (!blocked1 && !blocked2) patternScore = 500;
          else patternScore = 250;
        }
        else if (count === 1) {
          patternScore = 25;
        }
        
        if (board[r][c] === aiColor) {
          score += patternScore;
        } else {
          score += patternScore * 0.9;
        }
      }
    }
  }
  
  const centerRow = Math.floor(BOARD_SIZE / 2);
  const centerCol = Math.floor(BOARD_SIZE / 2);
  
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== 'empty') {
        const distFromCenter = Math.abs(r - centerRow) + Math.abs(c - centerCol);
        const positionBonus = (BOARD_SIZE - distFromCenter) * 3;
        
        if (board[r][c] === aiColor) {
          score += positionBonus;
        } else {
          score -= positionBonus * 0.5;
        }
      }
    }
  }
  
  return score;
}

export function findWinningLine(board, r, c, color) {
  const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
  for (const [dr, dc] of directions) {
    let cells = [[r, c]];
    for (let d = 1; d < WIN_LENGTH; d++) {
      const nr = r + dr * d, nc = c + dc * d;
      if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break;
      if (board[nr][nc] !== color) break;
      cells.push([nr, nc]);
    }
    for (let d = 1; d < WIN_LENGTH; d++) {
      const nr = r - dr * d, nc = c - dc * d;
      if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break;
      if (board[nr][nc] !== color) break;
      cells.push([nr, nc]);
    }
    if (cells.length >= WIN_LENGTH) {
      return cells;
    }
  }
  return [];
}
