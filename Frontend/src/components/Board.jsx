import React from 'react';
export default function Board({ board, onCellClick, winningCells }) {
  const BOARD_SIZE = 10;

  return (
    <div className="board">
      {Array.from({ length: BOARD_SIZE }).map((_, r) =>
        Array.from({ length: BOARD_SIZE }).map((_, c) => {
          const cellValue = board[r][c];
          const isWinner = winningCells.some(([wr, wc]) => wr === r && wc === c);
          
          return (
            <button
              key={`${r}-${c}`}
              className={`cell ${cellValue} ${isWinner ? 'winner' : ''}`}
              onClick={() => onCellClick(r, c)}
              disabled={cellValue !== 'empty'}
            >
              {cellValue === 'black' ? '●' : cellValue === 'white' ? '○' : ''}
            </button>
          );
        })
      )}
    </div>
  );
}
