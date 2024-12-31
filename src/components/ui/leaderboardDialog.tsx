import { LeaderboardEntryI, UserI } from "@/types";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface LeaderboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaderboard: LeaderboardEntryI[];
  currentUser: UserI | null;
  userRank: number | null;
}

export function LeaderboardDialog({
  open,
  onOpenChange,
  leaderboard,
  currentUser,
  userRank,
}: LeaderboardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-lg shadow-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            🏆 Leaderboard
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* Top 10 Leaderboard */}
          <div className="max-h-[300px] overflow-y-auto rounded-lg border shadow-inner bg-white">
            <h3 className="font-bold mb-2 px-4 pt-2">Top 10 Players</h3>
            {leaderboard.slice(0, 10).map((entry, index) => (
              <div
                key={index}
                className={`flex justify-between items-center py-2 px-4 last:border-none ${
                  currentUser && entry.uuid === currentUser.uuid
                    ? "bg-blue-100 "
                    : ""
                }`}
              >
                <div>
                  <span className="font-bold">#{index + 1} </span>
                  <span>{entry.username}</span>
                </div>
                <div className="flex gap-2 text-right">
                  <span className="font-mono">{entry.time.toFixed(3)}s</span>
                </div>
              </div>
            ))}
          </div>
          {/* Current User's Rank */}
          {currentUser && userRank && (
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2 px-4">Your Ranking</h3>
              <div className="flex justify-between items-center py-2 px-4 bg-blue-100 rounded-lg shadow-sm">
                <div>
                  <span className="font-bold">#{userRank} </span>
                  <span>{currentUser.username}</span>
                </div>
                <div>
                  <span className="font-mono">
                    {leaderboard
                      .find((entry) => entry.uuid === currentUser.uuid)
                      ?.time.toFixed(3)}
                    s
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-lg"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
