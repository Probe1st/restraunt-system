"use client";

import { useState } from "react";
import EmployeesSection from "@/components/admin/EmployeesSection";
import ShiftsSection from "@/components/admin/ShiftsSection";
import OrdersSection from "@/components/admin/OrdersSection";

export default async function AdminPage() {
    const [activeTab, setActiveTab] =
        (useState < "employees") | "orders" | ("shifts" > "employees");

    const accessToken = request.headers.get("authorization").split(" ")[1];

    const {
        payload: { role },
    } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.JWT_SECRET),
    );

    if (role !== "admin") {
        return (
            <div className="p-8 text-red-500">
                У вас нет прав доступа к этой странице
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Панель администратора
                </h1>

                {/* Навигация */}
                <div className="flex space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab("employees")}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === "employees"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700"
                        }`}
                    >
                        Сотрудники
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === "orders"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700"
                        }`}
                    >
                        Заказы
                    </button>
                    <button
                        onClick={() => setActiveTab("shifts")}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === "shifts"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700"
                        }`}
                    >
                        Смены
                    </button>
                </div>

                {/* Контент */}
                {activeTab === "employees" && <EmployeesSection />}
                {activeTab === "orders" && <OrdersSection />}
                {activeTab === "shifts" && <ShiftsSection />}
            </div>
        </div>
    );
}
