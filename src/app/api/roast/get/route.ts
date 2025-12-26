import { getRoastLogs } from '@/lib/sheets';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const indexStr = searchParams.get('index');

        if (!indexStr) {
            return NextResponse.json({ error: 'Index is required' }, { status: 400 });
        }

        const index = parseInt(indexStr, 10);
        const rows = await getRoastLogs();

        // rows[0] is header. So 0-based index from list corresponds to rows[index + 1]
        // The list API returns ID = map index.
        // Let's verify list logic: rows.slice(1).map((row, index) -> id: index)
        // So ID 0 is rows[1]. ID 1 is rows[2].

        const targetRow = rows[index + 1];

        if (!targetRow) {
            return NextResponse.json({ error: 'Log not found' }, { status: 404 });
        }

        const [date, title, weight, duration, dtr, jsonData] = targetRow;

        let parsedData = { dataPoints: [], events: [] };
        try {
            parsedData = JSON.parse(jsonData);
        } catch (e) {
            console.error("Failed to parse JSON data from sheet", e);
        }

        return NextResponse.json({
            id: index,
            date,
            title,
            ...parsedData
        });

    } catch (error) {
        console.error('Get roast error:', error);
        return NextResponse.json({ error: 'Failed to fetch roast' }, { status: 500 });
    }
}
