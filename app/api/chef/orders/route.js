import { DatabaseService } from "@/utilities/DatabaseService";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { Pool } from "pg";

// Подключение к PostgreSQL
const pool = new Pool({
    host: process.env.DATABASE_URL,
    port: process.env.DATABASE_PORT,

    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
});

export async function GET(request) {
    const accessToken = request.headers.get("authorization").split(" ")[1];

    const {
        payload: { role },
    } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.JWT_SECRET),
    );

    if (role !== "chef") {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const client = await pool.connect();

    const userQuery = await client.query(
        "SELECT * FROM orders WHERE status = $1",
        ["received"],
    );

    client.release();

    return NextResponse.json(userQuery.rows);
}
