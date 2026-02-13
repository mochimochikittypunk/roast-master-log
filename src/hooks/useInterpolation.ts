'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { DataPoint } from '@/types';
import { calculateRoRPerSecond, interpolateTemperature } from '@/lib/roast-math';

/**
 * useInterpolation - Generates interpolated chart data points between manual readings.
 *
 * When the timer is running and at least 2 manual readings exist, this hook:
 * 1. Calculates RoR (°C/s) from the last two manual points
 * 2. Generates 1-second interval interpolated points from the last manual point to currentTime
 * 3. Merges manual + interpolated into a single sorted array for chart rendering
 */
export const useInterpolation = (
    manualDataPoints: DataPoint[],
    currentTime: number,
    isRunning: boolean
) => {
    const [interpolatedPoints, setInterpolatedPoints] = useState<DataPoint[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const prevManualLengthRef = useRef(0);

    // Calculate current RoR per second from last two manual points
    const currentRoRPerSecond = useMemo(() => {
        if (manualDataPoints.length < 2) return null;
        const prev = manualDataPoints[manualDataPoints.length - 2];
        const curr = manualDataPoints[manualDataPoints.length - 1];
        return calculateRoRPerSecond(
            prev.temperature, prev.timestamp,
            curr.temperature, curr.timestamp
        );
    }, [manualDataPoints]);

    // Get the last manual data point info for interpolation base
    const lastManualPoint = useMemo(() => {
        if (manualDataPoints.length === 0) return null;
        return manualDataPoints[manualDataPoints.length - 1];
    }, [manualDataPoints]);

    // Clear old interpolated data when new manual point is added
    useEffect(() => {
        if (manualDataPoints.length !== prevManualLengthRef.current) {
            prevManualLengthRef.current = manualDataPoints.length;
            setInterpolatedPoints([]);
        }
    }, [manualDataPoints.length]);

    // Generate interpolated points every second
    useEffect(() => {
        // Cleanup previous interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Only interpolate when running, have RoR, and have a base point
        if (!isRunning || currentRoRPerSecond === null || !lastManualPoint) {
            return;
        }

        intervalRef.current = setInterval(() => {
            setInterpolatedPoints(prev => {
                // Calculate the next timestamp
                const lastTimestamp = prev.length > 0
                    ? prev[prev.length - 1].timestamp
                    : lastManualPoint.timestamp;

                const nextTimestamp = lastTimestamp + 1;

                // Calculate elapsed seconds from last manual point
                const elapsed = nextTimestamp - lastManualPoint.timestamp;

                // Skip if elapsed is 0 (would be same as manual point)
                if (elapsed <= 0) return prev;

                const predictedTemp = interpolateTemperature(
                    lastManualPoint.temperature,
                    currentRoRPerSecond,
                    elapsed
                );

                const newPoint: DataPoint = {
                    timestamp: nextTimestamp,
                    temperature: parseFloat(predictedTemp.toFixed(1)),
                    ror: currentRoRPerSecond * 60, // Convert to °C/min for display
                    gas: lastManualPoint.gas,
                    damper: lastManualPoint.damper,
                    isInterpolated: true,
                };

                return [...prev, newPoint];
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning, currentRoRPerSecond, lastManualPoint]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Merge manual + interpolated, sorted by timestamp
    const chartDataPoints = useMemo(() => {
        if (interpolatedPoints.length === 0) return manualDataPoints;

        // Manual points are already sorted. Interpolated points start after the last manual point.
        // Simple concat since interpolated always come after the last manual point.
        return [...manualDataPoints, ...interpolatedPoints];
    }, [manualDataPoints, interpolatedPoints]);

    return {
        chartDataPoints,
        currentRoRPerSecond,
        interpolatedPoints,
    };
};
