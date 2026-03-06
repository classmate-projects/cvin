import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ online: false, reason: "No API Key configured" });
        }

        // Lightweight check using models list endpoint to verify API key validity without consuming heavy quota
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            return NextResponse.json({ online: true });
        } else {
            return NextResponse.json({ online: false, reason: `API Error: ${res.status}` });
        }
    } catch (e) {
        return NextResponse.json({ online: false, reason: e.message });
    }
}
