import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth_token")?.value;

        if (!authToken) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        // Backward compatibility for the hardcoded session
        if (authToken === "admin_session") {
            return NextResponse.json({
                user: {
                    id: 1,
                    name: "System Administrator",
                    email: "admin",
                    avatar: "https://ui-avatars.com/api/?name=Admin&background=00845a&color=fff",
                    role: "Admin"
                }
            });
        }

        // Decode base64
        const decoded = Buffer.from(authToken, "base64").toString("utf8");
        const userContext = JSON.parse(decoded);

        return NextResponse.json({
            user: {
                id: userContext.id,
                name: userContext.name,
                email: userContext.email,
                role: userContext.role,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userContext.name)}&background=00845a&color=fff`
            }
        });
    } catch (error) {
        console.error("Auth Me Error:", error);
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
