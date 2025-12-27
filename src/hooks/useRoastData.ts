import { useState, useCallback } from 'react';
import { DataPoint, RoastEvent } from '@/types';
import { calculateRoR } from '@/lib/roast-math';

export const useRoastData = () => {
    const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
    const [events, setEvents] = useState<RoastEvent[]>([]);
    const [currentGas, setCurrentGas] = useState(0);
    const [currentDamper, setCurrentDamper] = useState(0); // 0-100%

    const addReading = useCallback((timestamp: number, temperature: number) => {
        setDataPoints(prev => {
            // Calculate RoR based on previous data
            const ror = calculateRoR(temperature, timestamp, prev, 60);

            return [...prev, {
                timestamp,
                temperature,
                ror,
                gas: currentGas,
                damper: currentDamper
            }];
        });
    }, [currentGas, currentDamper]);

    const logEvent = useCallback((name: string, timestamp: number, temperature: number, type: RoastEvent['type']) => {
        setEvents(prev => [...prev, { name, timestamp, temperature, type }]);
    }, []);

    const setGas = useCallback((value: number) => {
        setCurrentGas(value);
    }, []);

    const setDamper = useCallback((value: number) => {
        setCurrentDamper(value);
    }, []);

    const resetData = useCallback(() => {
        setDataPoints([]);
        setEvents([]);
        setEvents([]);
        setCurrentGas(0);
        setCurrentDamper(0);
        // Do NOT reset reference data automatically? Or maybe yes?
        // Usually you want to keep the reference for the next roast unless explicitly cleared.
        // Let's keep it.
    }, []);

    // Reference Data State
    const [referenceData, setReferenceData] = useState<DataPoint[]>([]);

    return {
        dataPoints,
        events,
        currentGas,
        addReading,
        logEvent,
        setGas,
        setDamper,
        resetData,
        currentDamper,
        referenceData,
        setReferenceData
    };
};
