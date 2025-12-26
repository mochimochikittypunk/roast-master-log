'use client';

import { ControlPanel } from "@/components/roast/control-panel";
import { TimerDisplay } from "@/components/roast/timer-display";
import { ChartBoard } from "@/components/roast/chart-board";
import { MetricsPanel } from "@/components/roast/metrics-panel";
import { ManualInput } from "@/components/roast/manual-input";
import { LogSelector } from "@/components/roast/log-selector";

export default function RoastPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
            {/* Header / Timer Area */}
            <div className="lg:col-span-4 flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-amber-500">Roast Master Log</h1>
                    <ManualInput />
                    <LogSelector />
                </div>
                <TimerDisplay />
            </div>

            {/* Main Chart Area */}
            <div className="lg:col-span-3 bg-slate-900 p-4 rounded-xl border border-slate-800 min-h-[500px]">
                <ChartBoard />
            </div>

            {/* Controls & Metrics */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1">
                    <MetricsPanel />
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <ControlPanel />
                </div>
            </div>
        </div>
    );
}
