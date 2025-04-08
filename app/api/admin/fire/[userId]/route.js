import { DatabaseService } from "@/utilities/DatabaseService";

const Users = new DatabaseService("users");

export async function DELETE(request) {
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

    try {
        // Извлекаем userId из query-параметров
        const userId = request.url.split("/").reverse()[0];

        if (!userId) {
            return new Response("User ID is required", { status: 400 });
        }

        // Удаляем пользователя по ID
        const user = await Users.getById(userId);
        const result = await Users.update(userId, {
            ...user,
            is_active: false,
        });

        // Проверяем, был ли уволен пользователь
        if (!result) {
            return new Response("User not found", { status: 404 });
        }

        return new Response("User fired successfully", { status: 200 });
    } catch (error) {
        console.error("Error fired user:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
