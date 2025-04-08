import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { Pool } from "pg";
import { DatabaseService } from "@/utilities/DatabaseService";

// Настройки подключения к PostgreSQL
const pool = new Pool({
    host: process.env.DATABASE_URL,
    port: process.env.DATABASE_PORT,

    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
});

const Users = new DatabaseService("users");

export async function GET() {
    try {
        // 1. Получаем refreshToken из cookies
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            return new Response("Refresh token not found", { status: 401 });
        }

        // 2. Валидируем refreshToken через базу данных
        const client = await pool.connect();
        try {
            const res = await client.query(
                "SELECT * FROM refresh_tokens WHERE token = $1",
                [refreshToken],
            );

            if (res.rows.length === 0) {
                return new Response("Invalid refresh token", { status: 401 });
            }
        } finally {
            client.release();
        }

        // 3. Проверяем подпись и срок действия refreshToken (если используется JWT)
        let userId = -1;
        try {
            const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

            const {
                payload: { userId: id },
            } = await jwtVerify(refreshToken, secretKey);
            
            userId = id;
        } catch (error) {
            return new Response("Invalid or expired refresh token", {
                status: 401,
            });
        }

        // 4. Генерируем новый accessToken
        const user = await Users.getById(userId);
        const accessToken = await new SignJWT({
            userId: user.id,
            role: user.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRES_IN) 
            .sign(new TextEncoder().encode(process.env.JWT_SECRET));

        // 5. Возвращаем новый accessToken
        return new Response(JSON.stringify({ accessToken }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error refreshing token:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
