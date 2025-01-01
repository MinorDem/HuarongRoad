import { LeaderboardEntryI, UserI } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VictoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeElapsed: number;
  currentUser: UserI | null;
  username: string;
  onUsernameChange: (value: string) => void;
  leaderboard: LeaderboardEntryI[];
  onSaveScore: () => void;
  onUpdateScore: () => void;
  onPlayAgain: () => void;
}

export function VictoryDialog({
  open,
  onOpenChange,
  timeElapsed,
  currentUser,
  username,
  onUsernameChange,
  leaderboard,
  onSaveScore,
  onUpdateScore,
  onPlayAgain,
}: VictoryDialogProps) {
  const currentBestTime =
    leaderboard.find((entry) => entry.uuid === currentUser?.uuid)?.time ??
    Infinity;

  const isNewBest = timeElapsed < currentBestTime;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>🎉 Congratulations!</DialogTitle>
          <DialogDescription>
            You completed the puzzle in {timeElapsed.toFixed(2)} seconds!
          </DialogDescription>
        </DialogHeader>

        {currentUser ? (
          <div className="py-4">
            <p className="text-center text-gray-600">
              Playing as{" "}
              <span className="font-bold">{currentUser.username}</span>
            </p>
            {isNewBest ? (
              <p className="text-center text-green-600 mt-2">
                This is your new best time!
              </p>
            ) : (
              <p className="text-center text-red-600 mt-2">
                You didn’t beat your best time of {currentBestTime.toFixed(2)}{" "}
                seconds. Keep trying!
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {currentUser && isNewBest ? (
            <Button onClick={onUpdateScore}>Update Score</Button>
          ) : (
            <Button variant="outline" onClick={onPlayAgain}>
              Play Again
            </Button>
          )}
          {!currentUser && <Button onClick={onSaveScore}>Save Score</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
