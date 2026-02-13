'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor, Undo2 } from 'lucide-react';

import { ControlPanel } from "@/components/roast/control-panel";
import { TimerDisplay } from "@/components/roast/timer-display";
import { ChartBoard } from "@/components/roast/chart-board";
import { MetricsPanel } from "@/components/roast/metrics-panel";
import { ManualInput } from "@/components/roast/manual-input";
import { GuideDialog } from "@/components/roast/guide-dialog";
import { useRoast } from "@/context/roast-context";

export default function RoastPage() {
    const [isMobileView, setIsMobileView] = useState(false);
    const [showMobileChart, setShowMobileChart] = useState(false);
    const { undoLastReading, dataPoints } = useRoast();

    const UndoButton = ({ compact = false }: { compact?: boolean }) => (
        <Button
            onClick={undoLastReading}
            variant="outline"
            size={compact ? "sm" : "default"}
            className={`border-slate-700 hover:bg-slate-800 text-slate-400 ${compact ? 'h-8 text-xs px-2 w-full justify-center' : ''}`}
            disabled={dataPoints.length <= 1}
        >
            <Undo2 className={`${compact ? 'mr-1 h-3 w-3' : 'mr-2 h-4 w-4'}`} /> Undo
        </Button>
    );

    return (
        <div className={`h-full transition-all duration-300 ${isMobileView ? 'max-w-md mx-auto' : ''}`}>
            {/* View Toggle */}
            <div className="fixed bottom-4 right-4 z-50">
                <Button
                    onClick={() => setIsMobileView(!isMobileView)}
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-slate-800 border-slate-700 shadow-xl"
                    title={isMobileView ? "Switch to Desktop View" : "Switch to Mobile View"}
                >
                    {isMobileView ? <Monitor className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                </Button>
            </div>

            <div className={`grid gap-4 ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>
                {/* Header / Timer Area */}
                <div className={`${isMobileView ? 'col-span-1 flex-col items-stretch gap-4' : 'lg:col-span-4 flex justify-between items-center'} bg-slate-900 p-4 rounded-xl border border-slate-800`}>
                    <div className={`flex items-center gap-4 ${isMobileView ? 'justify-between' : ''}`}>
                        <h1 className={`${isMobileView ? 'text-xl' : 'text-2xl'} font-bold text-amber-500`}>Roast Master</h1>
                        {isMobileView && <TimerDisplay compact={true} />}
                    </div>

                    <div className={`flex items-start gap-2 ${isMobileView ? 'justify-between' : 'items-center'}`}>
                        <ManualInput />

                        {/* Right side controls - Stack vertical on mobile */}
                        {isMobileView ? (
                            <div className="flex flex-col gap-2">
                                <UndoButton compact />
                                <GuideDialog compact />
                            </div>
                        ) : (
                            <>
                                <UndoButton />
                                <GuideDialog />
                            </>
                        )}
                    </div>
                </div>

                {/* Main Chart Area */}
                <div className={`${isMobileView ? (showMobileChart ? 'col-span-1 h-[350px]' : 'hidden') : 'lg:col-span-3 min-h-[500px]'} bg-slate-900 p-4 rounded-xl border border-slate-800 transition-all`}>
                    <ChartBoard />
                </div>

                {/* Mobile Chart Toggle */}
                {isMobileView && (
                    <div className="col-span-1">
                        <Button
                            onClick={() => setShowMobileChart(!showMobileChart)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                            {showMobileChart ? 'グラフを隠す' : 'グラフを表示'}
                        </Button>
                    </div>
                )}

                {/* Controls & Metrics */}
                <div className={`${isMobileView ? 'col-span-1' : 'lg:col-span-1'} flex flex-col gap-4 pb-20`}>
                    {!isMobileView && <TimerDisplay />}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1">
                        <MetricsPanel />
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <ControlPanel />
                    </div>
                </div>
            </div>
        </div>
    );
}

