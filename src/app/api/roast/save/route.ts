import { appendRoastLog } from '@/lib/sheets';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, weight, startTime, duration, dtr, dataPoints, events } = body;

        const date = new Date(startTime).toISOString();
        const logDataString = JSON.stringify({ dataPoints, events });

        // Columns: Date, Title, Weight, Duration, DTR, Data (JSON)
        const row = [
            date,
            title || 'Untitled Roast',
            String(weight || 0),
            String(duration),
            String(dtr),
            logDataString
        ];

        await appendRoastLog(row);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ error: 'Failed to save roast' }, { status: 500 });
    }
}
