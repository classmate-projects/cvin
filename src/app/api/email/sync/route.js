import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { supabase } from "@/lib/supabase";
import { analyzeResumeBuffer } from "@/lib/ai-analyzer";

export async function POST(req) {
    let connection;
    try {
        const config = {
            imap: {
                user: process.env.EMAIL_USER,
                password: process.env.EMAIL_PASSWORD,
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT || "993"),
                tls: process.env.EMAIL_TLS === "true",
                authTimeout: 10000,
                tlsOptions: { rejectUnauthorized: false }
            }
        };

        if (!config.imap.user || !config.imap.password) {
            return Response.json({ success: false, message: "Email credentials not configured in .env" }, { status: 400 });
        }

        // 1. Check current pending count
        const { count: pendingCount, error: countError } = await supabase
            .from("resume")
            .select("*", { count: 'exact', head: true })
            .eq("status", "Pending")
            .eq("source", "Email");

        if (countError) throw countError;

        const MAX_PENDING = 20;
        const refillCount = MAX_PENDING - (pendingCount || 0);

        if (refillCount <= 0) {
            return Response.json({
                success: true,
                message: "Inbox full (20 items). Please review pending CVs before syncing more."
            });
        }

        connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        // Search for unseen messages with attachments
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], struct: true };

        let messages = await connection.search(searchCriteria, fetchOptions);

        // Sort messages to get NEWEST first (IMAP usually returns in ascending order of arrival)
        messages.reverse();

        // Limit to refill count
        const processingQueue = messages.slice(0, refillCount);

        let syncedCount = 0;

        for (const message of processingQueue) {
            // ... (rest of processing stays the same)
            const parts = imaps.getParts(message.attributes.struct);
            const attachments = parts.filter(part => part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT');

            if (attachments.length === 0) {
                // Mark as seen anyway otherwise we'll keep checking it
                await connection.addFlags(message.attributes.uid, '\\Seen');
                continue;
            }

            const all = message.parts.find(part => part.which === '');
            if (!all) continue;

            const parsed = await simpleParser(all.body);

            for (const attachment of parsed.attachments) {
                const mimeType = attachment.contentType;
                const isPDF = mimeType === 'application/pdf';
                const isDOCX = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

                if (isPDF || isDOCX) {
                    try {
                        const metadata = await analyzeResumeBuffer(attachment.content, mimeType);

                        const fileName = attachment.filename || `email_cv_${Date.now()}.pdf`;
                        const storagePath = `resumes/email_${Date.now()}_${fileName.replace(/\s+/g, '_')}`;

                        const { error: uploadError } = await supabase.storage
                            .from("resumes")
                            .upload(storagePath, attachment.content, {
                                contentType: mimeType,
                                upsert: false
                            });

                        if (uploadError) throw uploadError;

                        const { error: dbError } = await supabase.from("resume").insert([{
                            candidate_name: metadata.candidate_name || "Unknown Candidate",
                            file_name: fileName,
                            file_type: isPDF ? "pdf" : "docx",
                            storage_path: storagePath,
                            status: "Pending",
                            source: "Email",
                            sender_email: parsed.from?.value[0]?.address,
                            age: metadata.age,
                            job_title: metadata.job_title,
                            visa_status: metadata.visa_status,
                            experience_years: metadata.experience_years ? parseInt(metadata.experience_years) : null,
                            specialization: metadata.specialization,
                            email: metadata.email,
                            location: metadata.location,
                            education: metadata.education,
                            role: metadata.role
                        }]);

                        if (dbError) throw dbError;
                        syncedCount++;

                    } catch (err) {
                        console.error(`Failed to process attachment ${attachment.filename}:`, err);
                    }
                }
            }

            // Mark as seen
            await connection.addFlags(message.attributes.uid, '\\Seen');
        }

        connection.end();

        return Response.json({
            success: true,
            message: syncedCount > 0
                ? `Successfully added ${syncedCount} new CVs. Total pending list now at ${Math.min(MAX_PENDING, (pendingCount || 0) + syncedCount)}.`
                : "No new CV attachments found in your latest emails."
        });


    } catch (err) {
        if (connection) connection.end();
        console.error("Sync Error:", err);
        return Response.json({ success: false, message: "Connection failed: " + err.message }, { status: 500 });
    }
}
