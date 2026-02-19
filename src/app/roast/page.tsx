'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, PanelLeftClose, Undo2 } from 'lucide-react';

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

type ViewMode = 'live' | 'simple';
const STORAGE_KEY = 'roast-view-mode';
const MOBILE_BREAKPOINT = 768;

export default function RoastPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('live');
    // Track if the user has manually overridden the auto-detected mode
    const [hasManualOverride, setHasManualOverride] = useState(false);
    const { undoLast, canUndo } = useRoast();

    // On mount: detect mobile and restore saved preference
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
        if (saved === 'live' || saved === 'simple') {
            setViewMode(saved);
            setHasManualOverride(true);
        } else if (window.innerWidth < MOBILE_BREAKPOINT) {
            // Auto-switch to simple on mobile if no user preference saved
            setViewMode('simple');
        }
    }, []);

    // Listen for resize: only auto-switch if user hasn't manually overridden
    useEffect(() => {
        const handleResize = () => {
            if (!hasManualOverride) {
                setViewMode(window.innerWidth < MOBILE_BREAKPOINT ? 'simple' : 'live');
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [hasManualOverride]);

    const toggleViewMode = () => {
        const next: ViewMode = viewMode === 'live' ? 'simple' : 'live';
        setViewMode(next);
        setHasManualOverride(true);
        localStorage.setItem(STORAGE_KEY, next);
    };

    const isSimple = viewMode === 'simple';

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
        <div className="h-full transition-all duration-300">
            {/* View Mode Toggle FAB */}
            <div className="fixed bottom-4 right-4 z-50">
                <Button
                    onClick={toggleViewMode}
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-slate-800 border-slate-700 shadow-xl"
                    title={isSimple ? 'Switch to Live Mode' : 'Switch to Simple Mode'}
                >
                    {isSimple
                        ? <LayoutDashboard className="h-5 w-5 text-amber-400" />
                        : <PanelLeftClose className="h-5 w-5" />
                    }
                </Button>
            </div>

            <div className="flex flex-col gap-4 h-[calc(100vh-2rem)]">

                {/* Header / Timer Area */}
                <div className={`${isSimple ? 'flex-col items-stretch gap-4' : 'flex justify-between items-center'} bg-slate-900 p-4 rounded-xl border border-slate-800 shrink-0`}>
                    <div className={`flex items-center gap-4 ${isSimple ? 'justify-between' : ''}`}>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <h1 className={`${isSimple ? 'text-xl' : 'text-2xl'} font-bold text-amber-500 whitespace-nowrap`}>Roast Master</h1>
                                <div className="lg:hidden">
                                    <AuthControl />
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-600 font-mono">v{packageJson.version}</span>
                        </div>
                        {isSimple && <TimerDisplay compact={true} />}
                    </div>

                    {/* Middle Section: Bean Info */}
                    <div className={`${isSimple ? 'w-full' : 'flex-1 px-8'}`}>
                        <BeanInfoInput />
                    </div>

                    <div className={`flex items-start gap-2 ${isSimple ? 'justify-between' : 'items-center'}`}>
                        <ManualInput />

                        {/* Right side controls */}
                        {isSimple ? (
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

                {/* ─────────────────────────────────────────
                    LIVE MODE: Chart left + sidebar right
                ───────────────────────────────────────── */}
                {!isSimple && (
                    <div className="flex flex-1 min-h-0 overflow-hidden flex-row gap-3">
                        {/* Chart */}
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1 h-full">
                            <ChartBoard />
                        </div>

                        {/* Sidebar */}
                        <div className="w-[320px] flex flex-col gap-4 h-full overflow-y-auto pr-2 shrink-0">
                            <TimerDisplay />

                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shrink-0">
                                <MetricsPanel />
                            </div>

                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shrink-0">
                                <ControlPanel />
                            </div>
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────
                    SIMPLE MODE: Full-width single column
                ───────────────────────────────────────── */}
                {isSimple && (
                    <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto pb-20">
                        {/* Timer — large, full-width */}
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shrink-0 flex items-center justify-center">
                            <TimerDisplay />
                        </div>

                        {/* Metrics: Bean Temp / RoR / DTR */}
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shrink-0">
                            <MetricsPanel />
                        </div>

                        {/* Controls: Gas / Damper / Start / Phase buttons */}
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shrink-0">
                            <ControlPanel />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
