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

export const ChartBoard = () => {
    const { dataPoints, events, referenceData } = useRoast();

    // Custom Tooltip
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-lg">
                    <p className="text-slate-300 text-xs mb-1">{`Time: ${Math.floor(label / 60)}:${(label % 60).toString().padStart(2, '0')}`}</p>
                    {payload.map((entry: any) => (
                        <p key={entry.name} style={{ color: entry.color }} className="text-sm font-bold">
                            {entry.name}: {entry.value.toFixed(1)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={dataPoints}
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
                        dot={{ r: 4, strokeWidth: 2 }}
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

                    {/* Reference Line (Ghost Roast) */}
                    <Line
                        yAxisId="left"
                        data={referenceData}
                        type="monotone"
                        dataKey="temperature"
                        name="Reference"
                        stroke="#ffffff"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        strokeOpacity={0.3}
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
    );
};
