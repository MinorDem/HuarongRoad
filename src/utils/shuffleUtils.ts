import { BoardI, orderedState, TileI } from "@/types";

export const findEmptyTile = (board: BoardI): [number, number] => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === null) return [row, col];
    }
  }
  return [-1, -1];
};

export const isSolvable = (board: BoardI): boolean => {
  const flatBoard = board.flat().filter((tile): tile is TileI => tile !== null);
  let inversions = 0;

  for (let i = 0; i < flatBoard.length - 1; i++) {
    for (let j = i + 1; j < flatBoard.length; j++) {
      if (flatBoard[i].id > flatBoard[j].id) inversions++;
    }
  }

  return inversions % 2 === 0;
};

export const checkWin = (board: BoardI): boolean => {
  let count = 1;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (row === 2 && col === 2) return true;
      if (board[row][col]?.id !== count++) return false;
    }
  }
  return true;
};

export const shuffleBoard = (): BoardI => {
  let newBoard: BoardI;
  let moveCount = 0;
  const minMoves = 50;

  do {
    newBoard = JSON.parse(JSON.stringify(orderedState));
    moveCount = 0;

    while (moveCount < 1000) {
      const [emptyRow, emptyCol] = findEmptyTile(newBoard);

      const possibleMoves = [
        [emptyRow - 1, emptyCol],
        [emptyRow + 1, emptyCol],
        [emptyRow, emptyCol - 1],
        [emptyRow, emptyCol + 1],
      ].filter(([r, c]) => r >= 0 && r < 3 && c >= 0 && c < 3);

      const [newRow, newCol] =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      [newBoard[emptyRow][emptyCol], newBoard[newRow][newCol]] = [
        newBoard[newRow][newCol],
        newBoard[emptyRow][emptyCol],
      ];

      moveCount++;
    }
  } while (!isSolvable(newBoard) || checkWin(newBoard) || moveCount < minMoves);

  return newBoard;
};

export const validateShuffledBoard = (board: BoardI): boolean => {
  const numbers = new Set<number>();
  let hasNull = false;

  board.forEach((row) => {
    row.forEach((tile) => {
      if (tile === null) {
        hasNull = true;
      } else {
        numbers.add(tile.id);
      }
    });
  });

  return (
    hasNull &&
    numbers.size === 8 &&
    Array.from(numbers).every((n) => n >= 1 && n <= 8) &&
    isSolvable(board)
  );
};
