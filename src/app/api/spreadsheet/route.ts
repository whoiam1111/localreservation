import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { name, phone_suffix, region, lead, team } = await req.json();

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY as string),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.SPREADSHEET_ID;

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: '시트1!A:K',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [['A', name, phone_suffix, '', '', region, team, lead]],
            },
        });

        return NextResponse.json({ message: '작성 완료' });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Spreadsheet API error:', err.message, err.stack);
            return new NextResponse(JSON.stringify({ error: '스프레드시트 작성 실패' }), {
                status: 500,
            });
        }
        console.error('Unknown error:', err);
        return new NextResponse(JSON.stringify({ error: '스프레드시트 작성 실패' }), {
            status: 500,
        });
    }
}
