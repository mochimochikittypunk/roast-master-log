import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Environment variables
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    console.warn("Google Sheets credentials missing in environment variables.");
}

const auth = new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

export const appendRoastLog = async (data: string[]) => {
    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Logs!A:Z', // Assuming sheet name is 'Logs'
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [data],
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error appending to sheets:', error);
        throw error;
    }
};

export const getRoastLogs = async () => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Logs!A:Z',
        });
        return response.data.values || [];
    } catch (error) {
        console.error('Error fetching sheets:', error);
        throw error;
    }
};
