'use client';

import { useRoast } from "@/context/roast-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Play, Square } from "lucide-react";

export const ControlPanel = () => {
    const {
        isRunning, start, stop,
        time, addReading, logEvent,
        currentGas, setGas,
        dataPoints, events, dtr,
        // Use shared manual input
        manualTemp, setManualTemp
    } = useRoast();

    // Save Dialog State
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [roastTitle, setRoastTitle] = useState('');
    const [beanWeight, setBeanWeight] = useState('200');
    const [isSaving, setIsSaving] = useState(false);

    const handleStart = () => {
        start();

        // Use manualTemp as default/charge temp if available
        const val = parseFloat(manualTemp);
        const startTemp = !isNaN(val) ? val : 0;

        logEvent('Start', 0, startTemp, 'start');

        if (!isNaN(val)) {
            addReading(0, val);
            setManualTemp('');
        }
    };

    const handleStop = () => {
        stop();
        logEvent('Drop', time, 0, 'end');
        setIsSaveOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                title: roastTitle,
                weight: parseFloat(beanWeight),
                startTime: Date.now(),
                duration: time,
                dtr: dtr,
                dataPoints,
                events
            };

            const res = await fetch('/api/roast/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Roast Saved!");
                setIsSaveOpen(false);
                setRoastTitle('');
            } else {
                alert("Failed to save.");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving roast.");
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
            // Focus back to input?
            // Since input is in Header, we might need a ref via Context if we want to force focus.
            // But usually user clicks button, they might want to type again.
            // For now, let's assume they just click back or "Add" also clears.
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
                    <Button onClick={handleStop} variant="destructive" className="w-full h-14 text-lg">
                        <Square className="mr-2" /> Drop / End
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

                    <div className="space-y-2 pt-4 border-t border-slate-800">
                        <label className="text-xs text-slate-500 font-bold uppercase">Gas Control</label>
                        <div className="flex gap-2 items-center">
                            <Button onClick={() => setGas(Math.max(0, parseFloat((currentGas - 0.1).toFixed(1))))} size="icon" variant="outline">-</Button>
                            <div className="flex-1 text-center font-mono font-bold text-xl">{currentGas.toFixed(1)}</div>
                            <Button onClick={() => setGas(parseFloat((currentGas + 0.1).toFixed(1)))} size="icon" variant="outline">+</Button>
                        </div>
                    </div>
                </>
            )}

            <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save Roast Log</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input
                                id="title"
                                value={roastTitle}
                                onChange={(e) => setRoastTitle(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="weight" className="text-right">Weight (g)</Label>
                            <Input
                                id="weight"
                                type="number"
                                value={beanWeight}
                                onChange={(e) => setBeanWeight(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSaveOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Log'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
