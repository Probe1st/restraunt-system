import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Пути, которые не требуют авторизации
const PUBLIC_ROUTES = ["/api/auth/login", "/api/auth/refresh"];

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // Пропускаем публичные маршруты
    if (PUBLIC_ROUTES.some((route) => path.startsWith(route))) {
        return NextResponse.next();
    }

    if (path.startsWith("/api")) {
        const authHeader = request.headers.get("authorization");

        if (!authHeader) {
            return NextResponse.json(
                { error: "Authorization header is required" },
                { status: 401 },
            );
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 401 },
            );
        }

        try {
            // Верифицируем токен
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(process.env.JWT_SECRET),
            );

            // Добавляем данные пользователя в заголовки запроса
            const headers = new Headers(request.headers);
            headers.set("x-user-id", payload.userId);
            headers.set("x-user-role", payload.role);

            return NextResponse.next({
                request: {
                    headers,
                },
            });
        } catch (err) {
            console.error("JWT verification error:", err);
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 },
            );
        }
    }

    // Для страниц проверяем токен в куках
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
        // Перенаправляем на страницу входа, если токена нет
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(loginUrl);
    }

    try {
        jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

        return NextResponse.next();
    } catch (err) {
        console.error("JWT verification error:", err);

        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", path);

        return NextResponse.redirect(loginUrl);
    }
}
