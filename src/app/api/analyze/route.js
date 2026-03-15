import { analyzeResumeBuffer } from "@/lib/ai-analyzer";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) return Response.json({ error: "No file provided" }, { status: 400 });

        const buffer = Buffer.from(await file.arrayBuffer());
        const metadata = await analyzeResumeBuffer(buffer, file.type);

        return Response.json({ success: true, metadata });
    } catch (error) {
        console.error("Analysis failed:", error);
        return Response.json({ error: "Analysis failed", details: error.message }, { status: 500 });
    }
}
