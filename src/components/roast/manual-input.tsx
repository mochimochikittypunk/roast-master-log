'use client';

import { useRoast } from "@/context/roast-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ManualInput = () => {
    const { manualTemp, setManualTemp, handleManualAdd, dataPoints, time, addReading } = useRoast();

    const handleQuickAdd = () => {
        // Get last temperature, default to 200 if no data
        const lastTemp = dataPoints.length > 0
            ? dataPoints[dataPoints.length - 1].temperature
            : 0;

        const newTemp = parseFloat((lastTemp + 1).toFixed(1));

        // Log it immediately
        addReading(time, newTemp);
    };

    return (
        <div className="flex items-center gap-2">
            <Button onClick={handleQuickAdd} variant="secondary" className="h-12 w-12 text-lg font-bold bg-slate-800 text-green-400 border border-slate-700 hover:bg-slate-700">
                +1
            </Button>
            <Input
                autoFocus
                type="number"
                placeholder="Temp"
                value={manualTemp}
                onChange={(e) => setManualTemp(e.target.value)}
                className="bg-slate-950 border-slate-700 text-lg h-12 w-24 font-mono text-right"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleManualAdd();
                }}
            />
            <Button onClick={handleManualAdd} className="h-12 bg-slate-700 font-bold px-4">
                ADD
            </Button>
        </div>
    );
};
