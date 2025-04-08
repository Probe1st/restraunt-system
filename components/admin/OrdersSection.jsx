// components/admin/OrdersSection.tsx
"use client";

import { useState, useEffect } from "react";

export default function OrdersSection() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/admin/orders");
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError("Не удалось загрузить заказы");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) =>
        statusFilter === "all" ? true : order.status === statusFilter,
    );

    const getStatusColor = (status) => {
        switch (status) {
            case "received":
                return "bg-yellow-100 text-yellow-800";
            case "preparing":
                return "bg-blue-100 text-blue-800";
            case "ready":
                return "bg-green-100 text-green-800";
            case "paid":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold">Управление заказами</h2>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded-md"
                >
                    <option value="all">Все статусы</option>
                    <option value="received">Принят</option>
                    <option value="preparing">Готовится</option>
                    <option value="ready">Готов</option>
                    <option value="paid">Оплачен</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-4">Загрузка заказов...</div>
            ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    ID
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Столик
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Гости
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Статус
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Сумма
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Дата
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-4 py-3 text-sm">
                                        #{order.id.slice(0, 6)}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        №{order.tableNumber}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {order.customersCount}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded text-sm ${getStatusColor(
                                                order.status,
                                            )}`}
                                        >
                                            {order.status === "received" &&
                                                "Принят"}
                                            {order.status === "preparing" &&
                                                "Готовится"}
                                            {order.status === "ready" &&
                                                "Готов"}
                                            {order.status === "paid" &&
                                                "Оплачен"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {order.totalAmount} ₽
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {new Date(
                                            order.createdAt,
                                        ).toLocaleDateString("ru-RU", {
                                            day: "numeric",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                            Нет заказов по выбранному фильтру
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
