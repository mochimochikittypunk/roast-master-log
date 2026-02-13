'use client';

import { useRoast } from "@/context/roast-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const MetricsPanel = () => {
    const { dtr, chartDataPoints, currentGas, currentRoRPerSecond, phaseRatios } = useRoast();

    // Get latest reading (including interpolated for real-time display)
    const latest = chartDataPoints[chartDataPoints.length - 1] || { temperature: 0, ror: 0, isInterpolated: false };

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
                    {latest.isInterpolated && (
                        <div className="text-[10px] text-amber-700">予測値</div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-xs text-slate-400 font-medium">RoR</CardTitle>
                </CardHeader>
                <CardContent className="pb-3 px-3">
                    <div className="text-2xl font-bold text-blue-400">
                        {currentRoRPerSecond !== null
                            ? (currentRoRPerSecond * 60).toFixed(1)
                            : (latest.ror ? latest.ror.toFixed(1) : '0.0')
                        }
                    </div>
                    <div className="text-[10px] text-slate-500">°C/min</div>
                </CardContent>
            </Card>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-xs text-slate-400 font-medium">Phase Ratio</CardTitle>
                </CardHeader>
                <CardContent className="pb-3 px-3">
                    <div className="text-2xl font-bold text-purple-400">
                        DTR {dtr.toFixed(1)}%
                    </div>
                    {phaseRatios.development > 0 && (
                        <div className="mt-1 flex h-2 rounded overflow-hidden">
                            <div className="bg-yellow-500" style={{ width: `${phaseRatios.drying}%` }} />
                            <div className="bg-orange-500" style={{ width: `${phaseRatios.maillard}%` }} />
                            <div className="bg-red-600" style={{ width: `${phaseRatios.development}%` }} />
                        </div>
                    )}
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
