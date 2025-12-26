'use client';

import { useRoast } from "@/context/roast-context";

export const TimerDisplay = () => {
    const { time, formatTime, currentPhase } = useRoast();

    // Phase color mapping
    const phaseColors = {
        drying: 'text-green-400',
        maillard: 'text-yellow-400',
        development: 'text-red-400',
        cooling: 'text-blue-400',
        ended: 'text-slate-400'
    };

    return (
        <div className="flex items-center gap-6">
            <div className="text-right">
                <div className="text-xs uppercase text-slate-500 font-bold tracking-wider">Current Phase</div>
                <div className={`text-xl font-bold uppercase ${phaseColors[currentPhase] || 'text-slate-400'}`}>
                    {currentPhase}
                </div>
            </div>
            <div className="text-6xl font-mono font-bold tracking-tight text-slate-100">
                {formatTime(time)}
            </div>
        </div>
    );
};
