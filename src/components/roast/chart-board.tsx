'use client';

import { useRoast } from "@/context/roast-context";
import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

// Custom dot renderer: show dots only for manual (non-interpolated) points
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ManualPointDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload?.isInterpolated) return null;
    return (
        <circle
            cx={cx}
            cy={cy}
            r={4}
            stroke="#fbbf24"
            strokeWidth={2}
            fill="#fbbf24"
        />
    );
};

export const ChartBoard = () => {
    const { chartDataPoints, events, phaseRatios } = useRoast();

    // Custom Tooltip
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-lg">
                    <p className="text-slate-300 text-xs mb-1">{`Time: ${Math.floor(label / 60)}:${(label % 60).toString().padStart(2, '0')}`}</p>
                    {payload.map((entry: any) => (
                        <p key={entry.name} style={{ color: entry.color }} className="text-sm font-bold">
                            {entry.name}: {entry.value?.toFixed(1)}
                            {entry.payload?.isInterpolated && entry.name === 'Bean Temp' ? ' (予測)' : ''}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const hasPhaseRatios = phaseRatios.development > 0;

    return (
        <div className="w-full">
            <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={chartDataPoints}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />

                        {/* Time Axis */}
                        <XAxis
                            dataKey="timestamp"
                            type="number"
                            domain={['dataMin', 'auto']}
                            tickFormatter={(unixTime) => {
                                const m = Math.floor(unixTime / 60);
                                const s = unixTime % 60;
                                return `${m}:${s.toString().padStart(2, '0')}`;
                            }}
                            stroke="#94a3b8"
                        />

                        {/* Left Axis: Temperature */}
                        <YAxis
                            yAxisId="left"
                            domain={[80, 190]}
                            label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', fill: '#fbbf24' }}
                            stroke="#fbbf24"
                        />

                        {/* Right Axis: RoR / Gas */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 20]}
                            label={{ value: 'RoR / Gas', angle: 90, position: 'insideRight', fill: '#60a5fa' }}
                            stroke="#60a5fa"
                        />

                        <Tooltip content={<CustomTooltip />} />
                        <Legend />

                        {/* Temperature Line - PRIMARY VISUAL */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="temperature"
                            name="Bean Temp"
                            stroke="#fbbf24"
                            strokeWidth={4}
                            dot={<ManualPointDot />}
                            activeDot={{ r: 6 }}
                            isAnimationActive={false}
                        />

                        {/* RoR Line - SECONDARY/Subtle */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="ror"
                            name="RoR"
                            stroke="#60a5fa"
                            strokeWidth={1}
                            strokeOpacity={0.6}
                            dot={false}
                            isAnimationActive={false}
                        />

                        {/* Gas Step - SECONDARY/Subtle */}
                        <Line
                            yAxisId="right"
                            type="stepAfter"
                            dataKey="gas"
                            name="Gas"
                            stroke="#94a3b8"
                            strokeWidth={1}
                            strokeDasharray="4 4"
                            strokeOpacity={0.4}
                            dot={false}
                            isAnimationActive={false}
                        />


                        {/* Event Lines */}
                        {events.map((e, i) => (
                            <ReferenceLine
                                key={i}
                                x={e.timestamp}
                                yAxisId="left"
                                stroke="#ef4444"
                                strokeDasharray="3 3"
                                label={{
                                    value: e.name,
                                    position: 'insideTopLeft',
                                    fill: '#ef4444',
                                    fontSize: 12
                                }}
                            />
                        ))}

                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Phase Ratio Bar */}
            {hasPhaseRatios && (
                <div className="mt-2 px-5">
                    <div className="flex h-7 rounded-lg overflow-hidden border border-slate-700">
                        {phaseRatios.drying > 0 && (
                            <div
                                className="flex items-center justify-center text-[11px] font-bold text-yellow-950 bg-yellow-500 transition-all duration-500"
                                style={{ width: `${phaseRatios.drying}%` }}
                            >
                                {phaseRatios.drying >= 8 && `Dry ${phaseRatios.drying.toFixed(1)}%`}
                            </div>
                        )}
                        {phaseRatios.maillard > 0 && (
                            <div
                                className="flex items-center justify-center text-[11px] font-bold text-orange-950 bg-orange-500 transition-all duration-500"
                                style={{ width: `${phaseRatios.maillard}%` }}
                            >
                                {phaseRatios.maillard >= 8 && `Mail ${phaseRatios.maillard.toFixed(1)}%`}
                            </div>
                        )}
                        {phaseRatios.development > 0 && (
                            <div
                                className="flex items-center justify-center text-[11px] font-bold text-red-50 bg-red-600 transition-all duration-500"
                                style={{ width: `${phaseRatios.development}%` }}
                            >
                                {phaseRatios.development >= 5 && `Dev ${phaseRatios.development.toFixed(1)}%`}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                        <span>Drying</span>
                        <span>Maillard</span>
                        <span>Development</span>
                    </div>
                </div>
            )}
        </div>
    );
};
