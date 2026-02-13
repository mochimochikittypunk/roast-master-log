import { useMemo } from 'react';
import { DataPoint, RoastEvent, RoastPhase } from '@/types';
import { calculateDTR, estimateFinishTime, estimateYellowTime } from '@/lib/roast-math';

export interface PhaseRatios {
    drying: number;     // 0-100%
    maillard: number;   // 0-100%
    development: number; // 0-100% (= DTR)
}

export const useRoastingMath = (
    currentTime: number,
    events: RoastEvent[],
    dataPoints: DataPoint[]
) => {
    // Determine Phase
    const currentPhase: RoastPhase = useMemo(() => {
        const hasEnd = events.some(e => e.type === 'end');
        if (hasEnd) return 'ended';

        const hasFC = events.some(e => e.name === '1st Crack' || e.name === 'First Crack');
        if (hasFC) return 'development';

        const hasYellow = events.some(e => e.name === 'Yellow' || e.name === 'Dry End');
        if (hasYellow) return 'maillard';

        return 'drying';
    }, [events]);

    // Calculate DTR
    const dtr = useMemo(() => {
        const fcEvent = events.find(e => e.name === '1st Crack' || e.name === 'First Crack');
        if (!fcEvent || currentTime <= fcEvent.timestamp) return 0;

        const devTime = currentTime - fcEvent.timestamp;
        const total = currentTime;

        return calculateDTR(devTime, total);
    }, [events, currentTime]);

    // Estimate End Time for specific DTR target
    const getEstimatedEndTime = (targetDTR: number) => {
        const fcEvent = events.find(e => e.name === '1st Crack' || e.name === 'First Crack');
        if (!fcEvent) return null;
        return estimateFinishTime(fcEvent.timestamp, targetDTR);
    };

    // Yellow Point auto-estimation (when Yellow not manually entered)
    const effectiveYellowTime = useMemo(() => {
        const yellowEvent = events.find(e => e.name === 'Yellow' || e.name === 'Dry End');
        if (yellowEvent) return yellowEvent.timestamp;

        // Yellow not entered → estimate 140°C arrival time from dataPoints
        return estimateYellowTime(dataPoints) ?? 0;
    }, [events, dataPoints]);

    // Phase Ratios (calculated once 1st Crack is entered)
    const phaseRatios: PhaseRatios = useMemo(() => {
        if (currentTime <= 0) return { drying: 0, maillard: 0, development: 0 };

        const fcEvent = events.find(e => e.name === '1st Crack' || e.name === 'First Crack');
        if (!fcEvent) return { drying: 0, maillard: 0, development: 0 };

        const fcTime = fcEvent.timestamp;
        const devRatio = ((currentTime - fcTime) / currentTime) * 100;
        const dryRatio = (effectiveYellowTime / currentTime) * 100;
        const mailRatio = ((fcTime - effectiveYellowTime) / currentTime) * 100;

        return {
            drying: Math.max(0, dryRatio),
            maillard: Math.max(0, mailRatio),
            development: Math.max(0, devRatio)
        };
    }, [currentTime, events, effectiveYellowTime]);

    return { currentPhase, dtr, getEstimatedEndTime, phaseRatios };
};
