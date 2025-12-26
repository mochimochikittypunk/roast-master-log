'use client';

import { useRoast } from "@/context/roast-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const MetricsPanel = () => {
    const { dtr, dataPoints, currentGas } = useRoast();

    // Get latest reading
    const latest = dataPoints[dataPoints.length - 1] || { temperature: 0, ror: 0 };

    return (
        <div className="grid grid-cols-2 gap-2">
            <Card className="bg-slate-950 border-slate-800">
                <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-xs text-slate-400 font-medium">Bean Temp</CardTitle>
                </CardHeader>
                <CardContent className="pb-3 px-3">
                    <div className="text-2xl font-bold text-amber-500">
                        {latest.temperature.toFixed(1)}°C
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-xs text-slate-400 font-medium">RoR (30s)</CardTitle>
                </CardHeader>
                <CardContent className="pb-3 px-3">
                    <div className="text-2xl font-bold text-blue-400">
                        {latest.ror ? latest.ror.toFixed(1) : '0.0'}
                    </div>
                    {/* <div className="text-[10px] text-slate-500">°C/min</div> */}
                </CardContent>
            </Card>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-xs text-slate-400 font-medium">DTR</CardTitle>
                </CardHeader>
                <CardContent className="pb-3 px-3">
                    <div className="text-2xl font-bold text-purple-400">
                        {dtr.toFixed(1)}%
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-xs text-slate-400 font-medium">Gas Pressure</CardTitle>
                </CardHeader>
                <CardContent className="pb-3 px-3">
                    <div className="text-2xl font-bold text-slate-200">
                        {currentGas.toFixed(1)} <span className="text-sm text-slate-500">kPa</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
