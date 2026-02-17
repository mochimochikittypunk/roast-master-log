'use client';

import { useRoast } from "@/context/roast-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Play, Square } from "lucide-react";

import { toPng } from 'html-to-image';

export const ControlPanel = () => {
    const {
        isRunning, start, stop,
        time, addReading, logEvent,
        currentGas, setGas,
        currentDamper, setDamper,
        manualTemp, setManualTemp
    } = useRoast();

    const [isSaving, setIsSaving] = useState(false);

    const handleStart = () => {
        start();
        const val = parseFloat(manualTemp);
        const startTemp = !isNaN(val) ? val : 0;
        logEvent('Start', 0, startTemp, 'start');
        if (!isNaN(val)) {
            addReading(0, val);
            setManualTemp('');
        }
    };

    const handleStop = async () => {
        stop();
        logEvent('Drop', time, 0, 'end');

        setIsSaving(true);
        // Wait a bit for the DOM to update (e.g. chart re-render)
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const dataUrl = await toPng(document.body, { cacheBust: true });
            const blob = await (await fetch(dataUrl)).blob();
            const filename = `roast-log-${Date.now()}.png`;

            // Check for Web Share API support (Mobile/Tablet)
            if (navigator.share) {
                const file = new File([blob], filename, { type: 'image/png' });
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Roast Log',
                        text: 'Roast Log Screenshot'
                    });
                } catch (shareError) {
                    console.log('Share cancelled or failed', shareError);
                }
            } else {
                // Fallback: Direct Download (PC)
                const link = document.createElement('a');
                link.download = filename;
                link.href = dataUrl;
                link.click();
            }
        } catch (err) {
            console.error('Screenshot failed', err);
            alert('Screenshot failed');
        } finally {
            setIsSaving(false);
        }
    };

    const logPhase = (name: string, type: 'phase_change') => {
        const val = parseFloat(manualTemp);
        if (!isNaN(val)) {
            addReading(time, val);
            logEvent(name, time, val, type);
            setManualTemp('');
        } else {
            alert("Please enter temperature in the top bar first");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                {!isRunning ? (
                    <Button onClick={handleStart} className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg">
                        <Play className="mr-2" /> Start Roast
                    </Button>
                ) : (
                    <Button onClick={handleStop} variant="destructive" className="w-full h-14 text-lg" disabled={isSaving}>
                        {isSaving ? <span className="animate-pulse">Saving...</span> : <><Square className="mr-2" /> Drop / End</>}
                    </Button>
                )}
            </div>

            {isRunning && (
                <>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            onClick={() => logPhase('Yellow', 'phase_change')}
                            className="bg-yellow-600 hover:bg-yellow-700 h-12 text-yellow-50"
                        >
                            Yellow Point
                        </Button>
                        <Button
                            onClick={() => logPhase('1st Crack', 'phase_change')}
                            className="bg-red-600 hover:bg-red-700 h-12 text-red-50"
                        >
                            1st Crack
                        </Button>
                    </div>

                    <div className="p-2 text-center text-xs text-slate-500">
                        Input temp at top bar, then click Event
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-slate-500 font-bold uppercase block text-center">Gas (kPa / %)</label>
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-1 items-center justify-center">
                                    <Button onClick={() => setGas(Math.max(0, parseFloat((currentGas - 0.1).toFixed(1))))} size="icon" variant="outline" className="h-8 w-8">-</Button>
                                    <div className="w-16 text-center font-mono font-bold text-lg">{currentGas.toFixed(1)}</div>
                                    <Button onClick={() => setGas(parseFloat((currentGas + 0.1).toFixed(1)))} size="icon" variant="outline" className="h-8 w-8">+</Button>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Input
                                        type="number"
                                        className="w-16 h-8 text-center text-xs p-1"
                                        placeholder="%"
                                        value={currentGas > 0 ? Math.round((currentGas / 2.6) * 100) : ''}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (!isNaN(val)) {
                                                const gas = (val / 100) * 2.6;
                                                setGas(Math.round(gas * 100) / 100);
                                            } else {
                                                setGas(0);
                                            }
                                        }}
                                    />
                                    <span className="text-xs text-slate-500">%</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 border-l border-slate-800 pl-4">
                            <label className="text-xs text-slate-500 font-bold uppercase block text-center">Damper (Level / %)</label>
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-1 items-center justify-center">
                                    <Button onClick={() => setDamper(Math.max(0, currentDamper - 10))} size="icon" variant="outline" className="h-8 w-8">-</Button>
                                    <div className="w-16 text-center font-mono font-bold text-lg">{(currentDamper / 10).toFixed(1)}</div>
                                    <Button onClick={() => setDamper(Math.min(100, currentDamper + 10))} size="icon" variant="outline" className="h-8 w-8">+</Button>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Input
                                        type="number"
                                        className="w-16 h-8 text-center text-xs p-1"
                                        placeholder="%"
                                        value={currentDamper}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (!isNaN(val)) {
                                                setDamper(Math.min(100, Math.max(0, val)));
                                            } else {
                                                setDamper(0);
                                            }
                                        }}
                                    />
                                    <span className="text-xs text-slate-500">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
