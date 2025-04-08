"use client";
import React, { useEffect, useState } from "react";

export default function Main() {
    // const { data: user, loading } = useUser();
    const user = { id: 1 };
    const loading = false;

    // Получаем роль пользователя из базы данных
    const [userRole, setUserRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetch("/api/get-user-role", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id }),
            })
                .then(async (response) => {

                    if (!response.ok) {
                        throw new Error("Failed to fetch user role");
                    }
                    return response.json();
                })
                .then((data) => {
                    setUserRole(data.role);
                    setRoleLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user role:", error);
                    setRoleLoading(false);
                });
        }
    }, [user]);

    if (loading || (user && roleLoading)) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div>Загрузка...</div>
            </div>
        );
    }

    const enrichedUser = user ? { ...user, role: userRole } : null;
    return <></>;
}
