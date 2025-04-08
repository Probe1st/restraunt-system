import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function POST(request) {
    const accessToken = request.headers.get("authorization").split(" ")[1];

    const {
        payload: { role },
    } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.JWT_SECRET),
    );
    console.log(role);

    return NextResponse.json({}, { status: 200 });
}
