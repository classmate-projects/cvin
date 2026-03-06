import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth_token")?.value;

        if (authToken === "admin_session") {
            return NextResponse.json({
                user: {
                    name: "System Administrator",
                    email: "admin@cvin.system",
                    avatar: "https://ui-avatars.com/api/?name=Admin&background=00845a&color=fff",
                    role: "Admin"
                }
            });
        }

        return NextResponse.json({ user: null }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
