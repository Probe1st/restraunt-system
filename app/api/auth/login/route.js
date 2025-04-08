import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Pool } from "pg";
import keccak256 from "keccak256";
import { SignJWT } from "jose";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 дней в секундах
};

// Подключение к PostgreSQL
const pool = new Pool({
    host: process.env.DATABASE_URL,
    port: process.env.DATABASE_PORT,

    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
});

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // 1. Проверяем наличие username и password
        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 },
            );
        }

        // 2. Ищем пользователя в базе данных
        const client = await pool.connect();
        try {
            const userQuery = await client.query(
                "SELECT id, username, password_hash, role FROM users WHERE username = $1 AND is_active = TRUE",
                [username],
            );

            if (userQuery.rows.length === 0) {
                return NextResponse.json(
                    { error: "Invalid credentials" },
                    { status: 401 },
                );
            }

            const user = userQuery.rows[0];

            // 3. Проверяем пароль
            const isPasswordValid =
                user.password_hash === keccak256(password).toString("hex");

            if (!isPasswordValid) {
                return NextResponse.json(
                    { error: "Invalid credentials" },
                    { status: 401 },
                );
            }

            // Создаем секретный ключ для JWT
            const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

            // 4. Генерируем токены
            const accessToken = await new SignJWT({
                userId: user.id,
                role: user.role,
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRES_IN || "15m")
                .sign(secretKey);

            const refreshToken = await new SignJWT({
                userId: user.id,
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRES_IN || "7d")
                .sign(secretKey);

            // 5. Сохраняем refresh token в базу
            await client.query(
                "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
                [
                    user.id,
                    refreshToken,
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
                ],
            );

            // 6. Устанавливаем cookies
            const response = NextResponse.json(
                {
                    userId: user.id,
                    username: user.username,
                    role: user.role,
                    accessToken,
                },
                { status: 200 },
            );

            (await cookies()).set("refreshToken", refreshToken, COOKIE_OPTIONS);

            // 7. Обновляем last_login
            await client.query(
                "UPDATE users SET last_login = NOW() WHERE id = $1",
                [user.id],
            );

            return response;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
