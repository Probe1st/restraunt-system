// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";
import { jwtVerify } from "jose";

const pool = new Pool({
    host: process.env.DATABASE_URL,
    port: process.env.DATABASE_PORT,

    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
});

export async function POST(request) {
    try {
        // 1. Проверка аутентификации
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json(
                { error: "Authorization header required" },
                { status: 401 },
            );
        }

        const token = authHeader.split(" ")[1];
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET),
        );

        // 2. Проверка прав доступа (только официанты и админы)
        if (!payload.role || !["waiter"].includes(payload.role)) {
            return NextResponse.json(
                { error: "Insufficient permissions" },
                { status: 403 },
            );
        }

        // 3. Получение данных из запроса
        const { tableId, customersCount, items } = await request.json();

        // 4. Валидация данных
        const errors = [];
        if (!tableId) errors.push("tableId is required");
        if (!customersCount || customersCount < 1)
            errors.push("Invalid customers count");
        if (!items?.length) errors.push("At least one item required");

        if (errors.length > 0) {
            return NextResponse.json(
                { error: errors.join(", ") },
                { status: 400 },
            );
        }

        // 5. Проверка существования столика
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Проверка столика
            const tableCheck = await client.query(
                "SELECT id FROM tables WHERE id = $1",
                [tableId],
            );
            if (tableCheck.rowCount === 0) {
                return NextResponse.json(
                    { error: "Table not found" },
                    { status: 404 },
                );
            }

            // 6. Проверка существования блюд
            for (const item of items) {
                const menuItemCheck = await client.query(
                    "SELECT id FROM menu_items WHERE id = $1 AND is_available = TRUE",
                    [item.menuItemId],
                );

                if (menuItemCheck.rowCount === 0) {
                    return NextResponse.json(
                        {
                            error: `Menu item ${item.menuItemId} not found or unavailable`,
                        },
                        { status: 400 },
                    );
                }
            }

            // 7. Создание заказа
            const orderResult = await client.query(
                `INSERT INTO orders 
          (table_id, waiter_id, customers_count, status)
         VALUES ($1, $2, $3, 'received')
         RETURNING id, created_at`,
                [tableId, payload.userId, customersCount],
            );

            // 8. Добавление позиций
            for (const item of items) {
                await client.query(
                    `INSERT INTO order_items 
            (order_id, menu_item_id, quantity)
           VALUES ($1, $2, $3)`,
                    [orderResult.rows[0].id, item.menuItemId, item.quantity],
                );
            }

            await client.query("COMMIT");

            return NextResponse.json(
                {
                    success: true,
                    order: {
                        id: orderResult.rows[0].id,
                        tableId,
                        customersCount,
                        status: "received",
                        createdAt: orderResult.rows[0].created_at,
                        items,
                    },
                },
                { status: 201 },
            );
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Create order error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
