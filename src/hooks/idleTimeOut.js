// useIdleTimeout.js — tilføj onTimeout som parameter
import { useEffect, useRef } from "react";

export function useIdleTimeout(minutes = 2, onTimeout) {
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    const reset = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        onTimeoutRef.current?.();
      }, minutes * 60 * 1000);
    };

    const timer = { current: null };
    const events = ["touchstart", "mousemove", "mousedown", "keydown"];
    events.forEach((e) => window.addEventListener(e, reset));
    reset();

    return () => {
      clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [minutes]);
}