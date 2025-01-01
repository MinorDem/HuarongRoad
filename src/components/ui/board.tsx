import { BoardI } from "@/types";
import { Tile } from "./tile";

interface BoardProps {
  board: BoardI;
  onTileClick: (row: number, col: number) => void;
  isGameWon: boolean;
}

export function Board({ board, onTileClick, isGameWon }: BoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {board.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            tile={tile}
            onClick={() => onTileClick(rowIndex, colIndex)}
            isGameWon={isGameWon}
          />
        ))
      )}
    </div>
  );
}
