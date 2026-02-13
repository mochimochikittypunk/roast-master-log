'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useRoastTimer } from '@/hooks/useRoastTimer';
import { useRoastData } from '@/hooks/useRoastData';
import { useRoastingMath } from '@/hooks/useRoastingMath';
import { useInterpolation } from '@/hooks/useInterpolation';
import { DataPoint, RoastEvent, RoastPhase } from '@/types';

interface RoastContextType {
    // Timer
    time: number;
    isRunning: boolean;
    start: () => void;
    stop: () => void;
    reset: () => void;
    formatTime: (s: number) => string;

    // Data
    dataPoints: DataPoint[];
    chartDataPoints: DataPoint[];
    events: RoastEvent[];
    currentGas: number;
    setGas: (v: number) => void;
    currentDamper: number;
    setDamper: (v: number) => void;
    addReading: (t: number, temp: number) => void;
    logEvent: (name: string, t: number, temp: number, type: RoastEvent['type']) => void;

    // Math
    currentPhase: RoastPhase;
    dtr: number;
    getEstimatedEndTime: (target: number) => number | null;

    // Interpolation
    currentRoRPerSecond: number | null;

    // UI Binding for Manual Input
    manualTemp: string;
    setManualTemp: (v: string) => void;
    handleManualAdd: () => void;

    // Reference Data (Comparison)
    referenceData: DataPoint[];
    setReferenceData: (data: DataPoint[]) => void;
}

const RoastContext = createContext<RoastContextType | null>(null);

export const RoastProvider = ({ children }: { children: ReactNode }) => {
    const timer = useRoastTimer();
    const data = useRoastData();
    const math = useRoastingMath(timer.time, data.events);
    const interpolation = useInterpolation(data.dataPoints, timer.time, timer.isRunning);

    // Lifted UI State for Manual Input
    const [manualTemp, setManualTemp] = React.useState('');

    const handleManualAdd = () => {
        const val = parseFloat(manualTemp);
        if (!isNaN(val)) {
            data.addReading(timer.time, val);
            setManualTemp('');
        }
    };

    return (
        <RoastContext.Provider value={{
            ...timer,
            ...data,
            ...math,
            chartDataPoints: interpolation.chartDataPoints,
            currentRoRPerSecond: interpolation.currentRoRPerSecond,
            manualTemp,
            setManualTemp,
            handleManualAdd
        }}>
            {children}
        </RoastContext.Provider>
    );
};

export const useRoast = () => {
    const context = useContext(RoastContext);
    if (!context) {
        throw new Error('useRoast must be used within a RoastProvider');
    }
    return context;
};
