interface GameControlsProps {
  onReset: () => void;
  onShowLeaderboard: () => void;
  resetLabel: string;
}

export function GameControls({
  onReset,
  onShowLeaderboard,
  resetLabel,
}: GameControlsProps) {
  return (
    <div className="space-x-4">
      <button
        onClick={onReset}
        className="text-2xl px-6 py-3 bg-[#68b684] text-white rounded-lg shadow-md 
                 hover:bg-[#5ca374] transition-all duration-200 
                 hover:shadow-lg"
      >
        {resetLabel}
      </button>
      <button
        onClick={onShowLeaderboard}
        className="text-2xl px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md 
                 hover:bg-blue-600 transition-all duration-200 
                 hover:shadow-lg"
      >
        Leaderboard
      </button>
    </div>
  );
}
