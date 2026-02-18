import { useState, useCallback } from 'react';
import { DataPoint, RoastEvent } from '@/types';
import { calculateRoR } from '@/lib/roast-math';

type UndoAction =
    | { type: 'reading' }
    | { type: 'event'; eventName: string };

export const useRoastData = () => {
    const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
    const [events, setEvents] = useState<RoastEvent[]>([]);
    const [currentGas, setCurrentGas] = useState(0);
    const [currentDamper, setCurrentDamper] = useState(0); // 0-100%
    const [beanName, setBeanName] = useState('');
    const [beanWeight, setBeanWeight] = useState('');
    const [undoStack, setUndoStack] = useState<UndoAction[]>([]);

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
        setUndoStack(prev => [...prev, { type: 'reading' }]);
    }, [currentGas, currentDamper]);

    const logEvent = useCallback((name: string, timestamp: number, temperature: number, type: RoastEvent['type']) => {
        setEvents(prev => [...prev, { name, timestamp, temperature, type }]);
        // イベント記録時: 直前のaddReadingで積まれた'reading'を'event'に差し替える
        setUndoStack(prev => {
            if (prev.length === 0) return prev;
            return [...prev.slice(0, -1), { type: 'event', eventName: name }];
        });
    }, []);

    const setGas = useCallback((value: number) => {
        setCurrentGas(value);
    }, []);

    const setDamper = useCallback((value: number) => {
        setCurrentDamper(value);
    }, []);

    const canUndo = undoStack.length > 0 && dataPoints.length > 1;

    const undoLast = useCallback(() => {
        const lastAction = undoStack[undoStack.length - 1];
        if (!lastAction) return;

        if (lastAction.type === 'event') {
            // イベント+温度を両方取り消す
            setEvents(prev => prev.slice(0, -1));
            setDataPoints(prev => {
                if (prev.length <= 1) return prev;
                return prev.slice(0, -1);
            });
        } else {
            // 温度記録のみ取り消す
            setDataPoints(prev => {
                if (prev.length <= 1) return prev;
                return prev.slice(0, -1);
            });
        }

        setUndoStack(prev => prev.slice(0, -1));
    }, [undoStack]);

    const resetData = useCallback(() => {
        setDataPoints([]);
        setEvents([]);
        setCurrentGas(0);
        setCurrentDamper(0);
        setUndoStack([]);
    }, []);

    return {
        dataPoints,
        events,
        currentGas,
        addReading,
        logEvent,
        setGas,
        setDamper,
        resetData,
        undoLast,
        canUndo,
        currentDamper,
        beanName,
        setBeanName,
        beanWeight,
        setBeanWeight
    };
};
