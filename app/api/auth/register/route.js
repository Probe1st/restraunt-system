import { DatabaseService } from "@/utilities/DatabaseService";
import { jwtVerify } from "jose";
import keccak256 from "keccak256";
import { NextResponse } from "next/server";

const Users = new DatabaseService("users");

export async function POST(request) {
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

    const {username, password, full_name, role: newUserRole} = await request.json();

    try {
        await Users.create({
            username,
            password_hash: keccak256(password).toString('hex'),
            full_name,
            role: newUserRole,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {
                error: "Error in sending request to the db",
            },
            { status: 500 },
        );
    }

    return NextResponse.json({}, { status: 200 });
}
