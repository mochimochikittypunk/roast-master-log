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
import { BeanInfoInput } from "@/components/roast/bean-info-input";
import { useRoast } from "@/context/roast-context";
import { AuthControl } from "@/components/roast/auth-control";

import packageJson from '../../../package.json';

export default function RoastPage() {
    const [isMobileView, setIsMobileView] = useState(false);
    const [showMobileChart, setShowMobileChart] = useState(false);
    const { undoLast, canUndo } = useRoast();

    const UndoButton = ({ compact = false }: { compact?: boolean }) => (
        <Button
            onClick={undoLast}
            variant="outline"
            size={compact ? "sm" : "default"}
            className={`border-slate-700 hover:bg-slate-800 text-slate-400 ${compact ? 'h-8 text-xs px-2 w-full justify-center' : ''}`}
            disabled={!canUndo}
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

            <div className="flex flex-col gap-4 h-[calc(100vh-2rem)]">

                {/* Header / Timer Area */}
                <div className={`${isMobileView ? 'flex-col items-stretch gap-4' : 'flex justify-between items-center'} bg-slate-900 p-4 rounded-xl border border-slate-800 shrink-0`}>
                    <div className={`flex items-center gap-4 ${isMobileView ? 'justify-between' : ''}`}>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <h1 className={`${isMobileView ? 'text-xl' : 'text-2xl'} font-bold text-amber-500 whitespace-nowrap`}>Roast Master</h1>
                                <div className="lg:hidden">
                                    <AuthControl />
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-600 font-mono">v{packageJson.version}</span>
                        </div>
                        {isMobileView && <TimerDisplay compact={true} />}
                    </div>

                    {/* Middle Section: Bean Info */}
                    <div className={`${isMobileView ? 'w-full' : 'flex-1 px-8'}`}>
                        <BeanInfoInput />
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

                {/* Main Content Area - Flex on Desktop, Column on Mobile */}
                <div className={`flex flex-1 min-h-0 overflow-hidden ${isMobileView ? 'flex-col gap-4 overflow-y-auto pb-20' : 'flex-row gap-3'}`}>

                    {/* Main Chart Area */}
                    <div className={`bg-slate-900 p-4 rounded-xl border border-slate-800 transition-all ${isMobileView ? (showMobileChart ? 'h-[350px] shrink-0' : 'hidden') : 'flex-1 h-full'}`}>
                        <ChartBoard />
                    </div>

                    {/* Mobile Chart Toggle */}
                    {isMobileView && (
                        <div className="shrink-0">
                            <Button
                                onClick={() => setShowMobileChart(!showMobileChart)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700"
                            >
                                {showMobileChart ? 'グラフを隠す' : 'グラフを表示'}
                            </Button>
                        </div>
                    )}

                    {/* Controls & Metrics Sidebar */}
                    <div className={`${isMobileView ? 'flex flex-col gap-4' : 'w-[320px] flex flex-col gap-4 h-full overflow-y-auto pr-2 shrink-0'}`}>
                        {!isMobileView && <TimerDisplay />}

                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shrink-0">
                            <MetricsPanel />
                        </div>

                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shrink-0">
                            <ControlPanel />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

