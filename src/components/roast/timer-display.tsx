'use client';

import { useRoast } from "@/context/roast-context";

export const TimerDisplay = ({ compact = false }: { compact?: boolean }) => {
    const { time, formatTime, currentPhase } = useRoast();

    // Phase color mapping
    const phaseColors: Record<string, string> = {
        drying: 'text-green-400',
        maillard: 'text-yellow-400',
        development: 'text-red-400',
        cooling: 'text-blue-400',
        ended: 'text-slate-400'
    };

    return (
        <div className={`flex items-center ${compact ? 'gap-2' : 'gap-6'} ${compact ? 'scale-90 origin-right' : ''}`}>
            {!compact && (
                <div className="text-right">
                    <div className="text-xs uppercase text-slate-500 font-bold tracking-wider">Current Phase</div>
                    <div className={`text-xl font-bold uppercase ${phaseColors[currentPhase] || 'text-slate-400'}`}>
                        {currentPhase}
                    </div>
                </div>
            )}
            <div className={`font-mono font-bold tracking-tight text-slate-100 ${compact ? 'text-4xl' : 'text-4xl lg:text-5xl xl:text-6xl'} transition-all duration-300`}>
                {formatTime(time)}
            </div>
        </div>
    );
};
