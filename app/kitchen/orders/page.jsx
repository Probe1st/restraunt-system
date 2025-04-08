"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [orders, setOrders] = useState([
    {
      id: 1,
      tableNumber: 4,
      items: [
        { name: "Стейк Рибай", quantity: 2, notes: "Прожарка медиум" },
        { name: "Картофельное пюре", quantity: 2, notes: "" },
      ],
      status: "new",
      timeReceived: "14:30",
    },
    {
      id: 2,
      tableNumber: 7,
      items: [
        { name: "Борщ", quantity: 1, notes: "Без сметаны" },
        { name: "Цезарь с курицей", quantity: 1, notes: "" },
      ],
      status: "cooking",
      timeReceived: "14:35",
    },
  ]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-2xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (!user || user.role !== "cook") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            Доступ запрещен
          </h1>
          <p className="mb-6 text-gray-600">
            Эта страница доступна только для поваров
          </p>
          <a
            href="/dashboard"
            className="inline-block rounded-lg bg-[#357AFF] px-6 py-3 text-white hover:bg-[#2E69DE]"
          >
            Вернуться на главную
          </a>
        </div>
      </div>
    );
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "new":
        return "bg-orange-100 text-orange-700";
      case "cooking":
        return "bg-yellow-100 text-yellow-700";
      case "ready":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "new":
        return "Новый";
      case "cooking":
        return "Готовится";
      case "ready":
        return "Готов";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Заказы для кухни</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Стол №{order.tableNumber}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Получен в {order.timeReceived}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm ${getStatusBadgeClass(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="mb-6 space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600">x{item.quantity}</span>
                    </div>
                    {item.notes && (
                      <p className="mt-1 text-sm text-gray-600">{item.notes}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                {order.status === "new" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "cooking")}
                    className="rounded-lg bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-200"
                  >
                    Начать готовить
                  </button>
                )}
                {order.status === "cooking" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "ready")}
                    className="rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200"
                  >
                    Готово
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;