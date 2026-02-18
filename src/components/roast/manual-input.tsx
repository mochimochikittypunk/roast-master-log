'use client';

import { useRoast } from "@/context/roast-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ManualInput = () => {
    const { manualTemp, setManualTemp, handleManualAdd, dataPoints, time, addReading } = useRoast();

    return (
        <div className="flex items-center gap-2">
            <Input
                autoFocus
                type="number"
                placeholder="豆の温度"
                value={manualTemp}
                onChange={(e) => setManualTemp(e.target.value)}
                className="bg-slate-950 border-slate-700 text-lg h-12 w-24 font-mono text-right"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleManualAdd();
                }}
            />
            <Button onClick={handleManualAdd} className="h-12 bg-slate-700 font-bold px-4">
                記録
            </Button>
        </div>
    );
};
