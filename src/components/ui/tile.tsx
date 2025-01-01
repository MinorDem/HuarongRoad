import { TileI } from "@/types";
interface TileProps {
  tile: TileI | null;
  onClick: () => void;
  isGameWon: boolean;
}

export function Tile({ tile, onClick, isGameWon }: TileProps) {
  return (
    <div
      onClick={() => !isGameWon && tile && onClick()}
      className={`
        w-60 h-32 rounded-xl flex flex-col items-center justify-center
        transition-all duration-200
        ${
          tile
            ? "bg-gradient-to-br from-[#a3d8f4] to-[#87ceeb] text-white cursor-pointer shadow-md hover:scale-105 hover:shadow-lg"
            : "bg-transparent"
        }
      `}
    >
      {tile && (
        <>
          <div className="text-3xl font-bold mb-1">{tile.name}</div>
          <div className="text-xl">{tile.id}</div>
        </>
      )}
    </div>
  );
}
