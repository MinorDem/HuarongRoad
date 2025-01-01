import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

interface TimerProps {
  isRunning: boolean;
}

export interface TimerRef {
  getTime: () => number;
  setTime: (time: number) => void;
  startTime: () => void;
}

export const Timer = forwardRef<TimerRef, TimerProps>(({ isRunning }, ref) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRunning && hasStarted) {
      const startTime = Date.now() - timeElapsed * 1000;

      timer = setInterval(() => {
        setTimeElapsed((Date.now() - startTime) / 1000);
      }, 100);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, hasStarted, timeElapsed]);

  useImperativeHandle(ref, () => ({
    getTime: () => timeElapsed,
    setTime: (time: number) => setTimeElapsed(time),
    startTime: () => {
      setTimeElapsed(0);
      setHasStarted(true);
    },
  }));

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((totalSeconds % 1) * 10);

    if (minutes > 0) {
      return `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}.${milliseconds}`;
    }
    return `${seconds}.${milliseconds}`;
  };

  return (
    <div className="timer text-4xl font-bold text-gray-600 mb-4 flex ">
      <span className="mr-5">Time:</span>
      <div className="inline-block min-w-[120px] text-center">
        {formatTime(timeElapsed)}
        <span className="text-2xl ml-2">s</span>
      </div>
    </div>
  );
});

Timer.displayName = "Timer";
