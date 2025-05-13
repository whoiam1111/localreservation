import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

interface Entry {
    name: string;
    phone_suffix: string;
    region: string;
    lead: string;
    team: string;
    good: string;
    improve: string;
    next: string;
}

export async function POST(req: NextRequest) {
    const entry: Entry = await req.json();

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY as string),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.SPREADSHEET_ID;

        const getRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: '시트1!B:C',
        });

        const existingRows = getRes.data.values || [];
        const existingSet = new Set(existingRows.map((row) => `${row[0]}|${row[1]}`));

        const key = `${entry.name}|${entry.phone_suffix}`;

        if (existingSet.has(key)) {
            return NextResponse.json({ message: '이미 등록된 항목입니다.' });
        }

        const newRow = ['A', entry.name, entry.phone_suffix, '', '', entry.region, entry.team, entry.lead, '', ''];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: '시트1!A:K', // 결과까지 포함하도록 L열까지
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [newRow],
            },
        });

        return NextResponse.json({ message: '1개의 항목이 추가되었습니다.' });
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
