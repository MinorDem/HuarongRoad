"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TourGuideProps {
  open: boolean;
  onComplete: () => void;
}

export function TourGuide({ open, onComplete }: TourGuideProps) {
  return (
    <Dialog open={open} onOpenChange={() => onComplete()}>
      <DialogContent className="sm:max-w-[425px] text-center rounded-lg shadow-md transition-all duration-300 ease-in-out">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Welcome! 🎉</DialogTitle>
        </DialogHeader>
        <p className="text-gray-700 mb-6">
          Rearrange the tiles in numerical order by sliding them into the empty
          space.
        </p>
        <button
          onClick={onComplete}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Start Game
        </button>
      </DialogContent>
    </Dialog>
  );
}
