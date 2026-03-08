import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from "mammoth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeResumeBuffer(buffer, mimeType) {
    let extractedText = "";
    let pdfPart = null;

    if (mimeType === "application/pdf") {
        pdfPart = {
            inlineData: {
                data: buffer.toString("base64"),
                mimeType: "application/pdf"
            }
        };
    } else if (
        mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        mimeType === "application/msword"
    ) {
        const { value } = await mammoth.extractRawText({ buffer });
        extractedText = value;
    } else {
        throw new Error("Unsupported file type: " + mimeType);
    }

    const modelsToTry = [
        "gemini-2.0-flash-lite-001",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro-latest"
    ];

    let result;
    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = `
                Extract this information from the resume: candidate_name, age, email, job_title, location, experience_years, visa_status, role, specialization, education.
                Return ONLY valid JSON. If missing, use null.
            `;

            if (pdfPart && (modelName.includes("flash") || modelName.includes("2.0") || modelName.includes("1.5"))) {
                result = await model.generateContent([prompt, pdfPart]);
            } else if (extractedText) {
                result = await model.generateContent([prompt, extractedText]);
            } else {
                continue;
            }

            if (result) break;
        } catch (err) {
            console.warn(`Model ${modelName} failed:`, err.message);
        }
    }

    if (!result) throw new Error("AI analysis failed on all models");

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI response was not valid JSON");

    return JSON.parse(jsonMatch[0]);
}
