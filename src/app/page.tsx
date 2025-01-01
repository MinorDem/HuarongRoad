"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Timer, TimerRef } from "@/components/ui/timer";
import { GameControls } from "@/components/ui/gameControls";
import { Board } from "@/components/ui/board";
import { VictoryDialog } from "@/components/ui/victoryDialog";
import { LeaderboardDialog } from "@/components/ui/leaderboardDialog";
import { BoardI, LeaderboardEntryI, UserI } from "@/types";
import { findEmptyTile, checkWin, shuffleBoard } from "@/utils/shuffleUtils";
import { TourGuide } from "@/components/ui/tourGuide";

export default function SlidingPuzzle() {
  const [board, setBoard] = useState<BoardI>([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [showVictoryDialog, setShowVictoryDialog] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState<UserI | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntryI[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const timerRef = useRef<TimerRef>(null);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("puzzleUser");
    if (!savedUser) {
      setShowTour(true);
    } else {
      setCurrentUser(JSON.parse(savedUser));
      resetGame();
    }
  }, []);

  const initializeUser = (username: string) => {
    const user: UserI = {
      username,
      uuid: uuidv4(),
    };
    sessionStorage.setItem("puzzleUser", JSON.stringify(user));
    setCurrentUser(user);
    return user;
  };

  const calculateUserRank = useCallback(
    (entries: LeaderboardEntryI[], currentUserUuid: string | undefined) => {
      if (!currentUserUuid) return null;
      const sortedEntries = [...entries].sort((a, b) => a.time - b.time);
      return (
        sortedEntries.findIndex((entry) => entry.uuid === currentUserUuid) + 1
      );
    },
    []
  );

  const resetGame = useCallback(() => {
    timerRef.current?.setTime(0);
    setBoard(shuffleBoard());
    setIsGameWon(false);
    setShowVictoryDialog(false);
  }, []);

  const startGame = useCallback(() => {
    setBoard(shuffleBoard());
    setShowTour(false);
    timerRef.current?.startTime();
  }, []);

  const moveTile = useCallback(
    (row: number, col: number) => {
      if (isGameWon) return;

      setBoard((currentBoard) => {
        const [emptyRow, emptyCol] = findEmptyTile(currentBoard);

        if (Math.abs(emptyRow - row) + Math.abs(emptyCol - col) === 1) {
          const newBoard = currentBoard.map((r) => [...r]);
          newBoard[emptyRow][emptyCol] = currentBoard[row][col];
          newBoard[row][col] = null;

          if (checkWin(newBoard)) {
            setTimeout(() => {
              setIsGameWon(true);
              setShowVictoryDialog(true);
            }, 50);
          }

          return newBoard;
        }

        return currentBoard;
      });
    },
    [isGameWon]
  );

  useEffect(() => {
    if (!board.length && !showTour) {
      const savedLeaderboard = localStorage.getItem("puzzleLeaderboard");
      if (savedLeaderboard) {
        const parsedLeaderboard = JSON.parse(savedLeaderboard);
        setLeaderboard(parsedLeaderboard);
        if (currentUser) {
          const userBestScore = parsedLeaderboard.find(
            (entry) => entry.uuid === currentUser.uuid
          )?.time;
          setBestScore(userBestScore || null);
          setUserRank(calculateUserRank(parsedLeaderboard, currentUser.uuid));
        }
      }
    }
  }, [board, currentUser, calculateUserRank, showTour]);

  const updateLeaderboard = (newLeaderboard: LeaderboardEntryI[]) => {
    setLeaderboard((prevLeaderboard) => {
      if (JSON.stringify(prevLeaderboard) !== JSON.stringify(newLeaderboard)) {
        return newLeaderboard;
      }
      return prevLeaderboard;
    });
  };

  const updateUserRank = (newRank: number | null) => {
    setUserRank((prevRank) => (prevRank !== newRank ? newRank : prevRank));
  };

  const loadLeaderboard = useCallback(async () => {
    try {
      const response = await fetch("/api/leaderboard", { method: "GET" });
      const topScores = await response.json();
      updateLeaderboard(topScores);

      if (currentUser) {
        const rankResponse = await fetch("/api/leaderboard/rank", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uuid: currentUser.uuid }),
        });
        const { rank } = await rankResponse.json();
        updateUserRank(rank);

        const userBestScore = topScores.find(
          (entry) => entry.uuid === currentUser.uuid
        )?.time;
        setBestScore(userBestScore || null);
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    loadLeaderboard();
    if (currentUser && !showTour) {
      timerRef.current?.startTime(); // Start timer if user exists and tour is not shown
    }
  }, [loadLeaderboard, currentUser, showTour]);

  const handleAddToLeaderboard = useCallback(
    async (isNewUser = false) => {
      if (isNewUser && !username.trim()) return;

      const user = currentUser || initializeUser(username);
      const newTime = timerRef.current?.getTime() || 0;

      if (bestScore !== null && newTime >= bestScore) {
        alert("Keep trying to beat your best score!");
        return;
      }

      const newEntry = {
        uuid: user.uuid,
        username: user.username,
        time: newTime,
        date: new Date().toLocaleDateString(),
      };

      try {
        const response = await fetch("/api/leaderboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEntry),
        });

        const { updated } = await response.json();
        if (updated) {
          await loadLeaderboard();
        }

        setShowVictoryDialog(false);
        setShowLeaderboard(true);
      } catch (error) {
        console.error("Error updating leaderboard:", error);
      }
    },
    [username, currentUser, loadLeaderboard, bestScore]
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f4e3] text-gray-700 font-sans">
      <header className="text-center mb-20 mt-16">
        <h1 className="text-4xl font-bold text-gray-700">
          Sliding Puzzle Game
        </h1>
      </header>

      <TourGuide onComplete={startGame} open={showTour} />

      <main className="flex-1 flex flex-col items-center">
        <div className="controls text-center mb-8">
          <Timer isRunning={!isGameWon && board.length > 0} ref={timerRef} />
          <GameControls
            resetLabel={
              board.length === 0
                ? "Start Game"
                : isGameWon
                ? "Play Again"
                : "Reset"
            }
            onReset={resetGame}
            onShowLeaderboard={() => setShowLeaderboard(true)}
          />
        </div>

        <Board board={board} onTileClick={moveTile} isGameWon={isGameWon} />
      </main>

      <VictoryDialog
        open={showVictoryDialog}
        onOpenChange={setShowVictoryDialog}
        timeElapsed={timerRef.current?.getTime() || 0}
        currentUser={currentUser}
        username={username}
        onUsernameChange={setUsername}
        leaderboard={leaderboard}
        onSaveScore={() => handleAddToLeaderboard(true)}
        onUpdateScore={() => handleAddToLeaderboard(false)}
        onPlayAgain={resetGame}
      />

      <LeaderboardDialog
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
        leaderboard={leaderboard}
        currentUser={currentUser}
        userRank={userRank}
      />

      <footer className="w-full text-center text-sm text-gray-600 mt-auto py-4">
        <div className="w-[90%] mx-auto border-t border-black mb-3" />
        <p>
          &copy; 2025 Sliding Puzzle Game. Created with the help of{" "}
          <b>Amazon Q</b>.
        </p>
      </footer>
    </div>
  );
}
