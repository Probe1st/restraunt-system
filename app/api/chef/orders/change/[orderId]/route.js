// app/api/orders/[orderId]/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";
import { jwtVerify } from "jose";

const pool = new Pool({
    host: process.env.DATABASE_URL,
    port: process.env.DATABASE_PORT,

    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
});

export async function POST(request, { params }) {
    try {
        // 1. Проверка аутентификации
        const authHeader = request.headers.get("authorization");

        const token = authHeader.split(" ")[1];
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET),
        );

        // 2. Проверка прав доступа
        if (!payload.role || !["chef"].includes(payload.role)) {
            return NextResponse.json(
                { error: "Insufficient permissions" },
                { status: 403 },
            );
        }

        // 3. Получение данных из запроса
        const { newStatus } = await request.json();
        const orderId = params.orderId;

        if (!newStatus) {
            return NextResponse.json(
                { error: "newStatus is required" },
                { status: 400 },
            );
        }

        // 4. Валидация статуса
        const validStatuses = ["received", "preparing", "ready", "paid"];
        if (!validStatuses.includes(newStatus)) {
            return NextResponse.json(
                { error: "Invalid order status" },
                { status: 400 },
            );
        }

        // 5. Обновление статуса в базе данных
        const client = await pool.connect();
        try {
            const result = await client.query(
                `UPDATE orders 
                SET status = $1, updated_at = NOW()
                WHERE id = $2
                RETURNING id, status, updated_at`,
                [newStatus, orderId],
            );

            if (result.rowCount === 0) {
                return NextResponse.json(
                    { error: "Order not found" },
                    { status: 404 },
                );
            }

            return NextResponse.json({
                success: true,
                order: result.rows[0],
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Order status update error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
