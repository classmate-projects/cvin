import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req) {
    try {
        console.log("--- DEBUG MODE: Resume Analysis ---");
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            console.error("DEBUG: No file provided");
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let extractedText = "";
        let pdfPart = null;

        if (file.type === "application/pdf") {
            console.log("DEBUG: PDF detected - using native extraction");
            pdfPart = {
                inlineData: {
                    data: buffer.toString("base64"),
                    mimeType: "application/pdf"
                }
            };
        } else if (
            file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            console.log("DEBUG: DOCX detected");
            const { value } = await mammoth.extractRawText({ buffer });
            extractedText = value;
        } else {
            return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "API key missing" }, { status: 500 });
        }

        // Expanded model pool to bypass specific model quotas
        const modelsToTry = [
            "gemini-2.0-flash-lite-001", // Newer lite model, often has separate quota
            "gemini-2.0-flash",          // Your primary model
            "gemini-2.0-flash-001",      // Specific version
            "gemini-pro-latest"          // Robust fallback
        ];

        let result;
        let quotaError = false;

        for (const modelName of modelsToTry) {
            try {
                console.log(`DEBUG: Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `
                  Extract this information from the resume: name, age, email, job_title, location, experience_years, visa_status, role, specialization, education.
                  Return ONLY valid JSON. If missing, use null.
                `;

                if (pdfPart && (modelName.includes("flash") || modelName.includes("2.0"))) {
                    result = await model.generateContent([prompt, pdfPart]);
                } else if (extractedText) {
                    result = await model.generateContent([prompt, extractedText]);
                } else {
                    continue; // Skip if model can't handle this input type
                }

                if (result) {
                    console.log(`DEBUG: SUCCESS with ${modelName}`);
                    break;
                }
            } catch (err) {
                console.warn(`DEBUG: ${modelName} failed - ${err.message}`);
                if (err.message.includes("429") || err.message.toLowerCase().includes("quota")) {
                    quotaError = true;
                }
            }
        }

        if (!result) {
            if (quotaError) {
                console.error("DEBUG: All models exhausted their quotas.");
                return NextResponse.json({
                    error: "All AI models are currently busy (Quota limit reached).",
                    details: "You've made several requests in a short time. Please wait 2-3 minutes for the 'Free Tier' limit to reset."
                }, { status: 429 });
            }
            throw new Error("Unable to process resume with available AI models.");
        }

        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("AI response was not valid JSON");

        const metadata = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ success: true, metadata });
    } catch (error) {
        console.error("DEBUG CRITICAL:", error);
        return NextResponse.json({ error: "Analysis failed", details: error.message }, { status: 500 });
    }
}
