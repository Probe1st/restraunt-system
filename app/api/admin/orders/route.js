import { DatabaseService } from "@/utilities/DatabaseService";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const Orders = new DatabaseService("orders");

export async function GET(request) {
    const accessToken = request.headers.get("authorization").split(" ")[1];

    const {
        payload: { role },
    } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.JWT_SECRET),
    );

    if (role !== "admin") {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(await Orders.getAll());
}
