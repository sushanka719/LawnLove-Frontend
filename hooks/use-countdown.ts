import { useEffect, useState, useCallback } from "react";

export function useCountdown(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const reset = useCallback(
    (seconds: number = initialSeconds) => setSecondsLeft(seconds),
    [initialSeconds],
  );

  return { secondsLeft, isDone: secondsLeft <= 0, reset };
}
