import { useState, useEffect, useRef, useCallback } from 'react';

export const useRoastTimer = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const accumulatedTimeRef = useRef<number>(0);

    const start = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
            startTimeRef.current = Date.now();

            intervalRef.current = setInterval(() => {
                if (startTimeRef.current) {
                    const now = Date.now();
                    const elapsed = Math.floor((now - startTimeRef.current) / 1000);
                    setTime(accumulatedTimeRef.current + elapsed);
                }
            }, 1000);
        }
    }, [isRunning]);

    const stop = useCallback(() => {
        if (isRunning && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsRunning(false);

            // Calculate exact elapsed time to add to accumulated
            if (startTimeRef.current) {
                const now = Date.now();
                accumulatedTimeRef.current += Math.floor((now - startTimeRef.current) / 1000);
                setTime(accumulatedTimeRef.current);
                startTimeRef.current = null;
            }
        }
    }, [isRunning]);

    const reset = useCallback(() => {
        stop();
        setTime(0);
        accumulatedTimeRef.current = 0;
        startTimeRef.current = null;
    }, [stop]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return { time, isRunning, start, stop, reset, formatTime };
};
