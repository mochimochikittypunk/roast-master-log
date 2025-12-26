import { getRoastLogs } from '@/lib/sheets';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const rows = await getRoastLogs();
        // Skip header if needed, or return all
        // Assuming first row is header
        const logs = rows.slice(1).map((row, index) => {
            // Safe access
            const [date, title, weight, duration, dtr, jsonData] = row;
            return {
                id: index,
                date,
                title,
                weight,
                duration,
                dtr,
                // We might not send full data for list to save bandwidth
            };
        });

        return NextResponse.json({ logs });
    } catch (error) {
        console.error('List error:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}
