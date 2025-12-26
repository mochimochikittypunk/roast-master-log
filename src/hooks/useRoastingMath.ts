import { useMemo } from 'react';
import { RoastEvent, RoastPhase } from '@/types';
import { calculateDTR, estimateFinishTime } from '@/lib/roast-math';

export const useRoastingMath = (
    currentTime: number,
    events: RoastEvent[]
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
        const total = currentTime; // Assuming starts at 0

        return calculateDTR(devTime, total);
    }, [events, currentTime]);

    // Estimate End Time for specific DTR target
    const getEstimatedEndTime = (targetDTR: number) => {
        const fcEvent = events.find(e => e.name === '1st Crack' || e.name === 'First Crack');
        if (!fcEvent) return null;
        return estimateFinishTime(fcEvent.timestamp, targetDTR);
    };

    return { currentPhase, dtr, getEstimatedEndTime };
};
