'use client';

import { useRoast } from "@/context/roast-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Play, Square, Flame, Fan, Calculator, RotateCcw, Save } from "lucide-react";

import { toPng } from 'html-to-image';
import { useAuth } from "@clerk/nextjs";
import { createSupabaseClient } from "@/lib/supabase-client";

export const ControlPanel = () => {
    const {
        isRunning, start, stop,
        time, addReading, logEvent,
        currentGas, setGas,
        currentDamper, setDamper,
        manualTemp, setManualTemp,
        beanId, beanWeight, beanName
    } = useRoast();

    const [isSaving, setIsSaving] = useState(false);
    const { getToken, userId } = useAuth();

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

        // Inventory Deduction Logic
        if (userId && beanId && beanWeight) {
            const weightInGrams = parseFloat(beanWeight);
            if (!isNaN(weightInGrams) && weightInGrams > 0) {
                try {
                    const token = await getToken({ template: 'supabase' });
                    const supabase = await createSupabaseClient(token);

                    // 1. Get current stock
                    const { data: currentData, error: fetchError } = await supabase
                        .from('inventory')
                        .select('stock_weight_kg, name')
                        .eq('id', beanId)
                        .single();

                    if (fetchError) {
                        console.error("Failed to fetch current stock:", fetchError);
                        alert(`在庫情報の取得に失敗しました: ${fetchError.message}`);
                    } else if (currentData) {
                        // 2. Calculate new stock (kg)
                        // Input is in grams, DB is in kg.
                        const deductionKg = weightInGrams / 1000;
                        const newStockKg = currentData.stock_weight_kg - deductionKg;

                        // 3. Update stock
                        const { error: updateError } = await supabase
                            .from('inventory')
                            .update({ stock_weight_kg: newStockKg })
                            .eq('id', beanId);

                        if (updateError) {
                            console.error("Failed to update stock:", updateError);
                            alert(`在庫の更新に失敗しました: ${updateError.message}`);
                        } else {
                            console.log(`Inventory updated. Deduced ${deductionKg}kg from ${currentData.name}`);
                            // alert(`${currentData.name}: ${weightInGrams}g を在庫から引き落としました。`);
                        }
                    }
                } catch (err) {
                    console.error("Unexpected error updating inventory:", err);
                }
            }
        }

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
            {/* Gas and Damper Controls - Always Visible */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase block text-center">Gas (kPa / %)</label>
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
                    <label className="text-[10px] text-slate-500 font-bold uppercase block text-center">Damper (Level / %)</label>
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
                                value={currentDamper > 0 ? currentDamper : ''}
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
                </>
            )}
        </div>
    );
};
