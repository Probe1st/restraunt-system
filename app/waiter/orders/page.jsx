"use client";
import React from "react";
import '../../global.css';

function MainComponent() {
  const { data: user, loading } = useUser();
  const [orders, setOrders] = useState([
    {
      id: 1,
      tableNumber: 4,
      guests: 3,
      status: "active",
      items: [
        { id: 1, name: "Борщ", quantity: 2, price: 350 },
        { id: 2, name: "Стейк", quantity: 1, price: 1200 },
      ],
      createdAt: "14:30",
    },
    {
      id: 2,
      tableNumber: 7,
      guests: 2,
      status: "ready",
      items: [
        { id: 3, name: "Цезарь", quantity: 2, price: 450 },
        { id: 4, name: "Паста", quantity: 1, price: 650 },
      ],
      createdAt: "14:45",
    },
  ]);

  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    tableNumber: "",
    guests: "",
    items: [],
  });

  const [error, setError] = useState(null);

  const menuItems = [
    { id: 1, name: "Борщ", price: 350, category: "Супы" },
    { id: 2, name: "Стейк", price: 1200, category: "Горячее" },
    { id: 3, name: "Цезарь", price: 450, category: "Салаты" },
    { id: 4, name: "Паста", price: 650, category: "Горячее" },
    { id: 5, name: "Тирамису", price: 400, category: "Десерты" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-2xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (!user || user.role !== "waiter") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            Доступ запрещен
          </h1>
          <p className="mb-6 text-gray-600">
            Эта страница доступна только для официантов
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

  const handleAddItem = (menuItem) => {
    const existingItem = newOrder.items.find((item) => item.id === menuItem.id);
    if (existingItem) {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.map((item) =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      setNewOrder({
        ...newOrder,
        items: [...newOrder.items, { ...menuItem, quantity: 1 }],
      });
    }
  };

  const handleRemoveItem = (itemId) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter((item) => item.id !== itemId),
    });
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setNewOrder({
      ...newOrder,
      items: newOrder.items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ),
    });
  };

  const handleCreateOrder = () => {
    if (
      !newOrder.tableNumber ||
      !newOrder.guests ||
      newOrder.items.length === 0
    ) {
      setError("Пожалуйста, заполните все поля и добавьте хотя бы одно блюдо");
      return;
    }

    const newOrderObj = {
      id: orders.length + 1,
      ...newOrder,
      status: "active",
      createdAt: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setOrders([...orders, newOrderObj]);
    setShowNewOrderModal(false);
    setNewOrder({ tableNumber: "", guests: "", items: [] });
    setError(null);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Управление заказами
          </h1>
          <button
            onClick={() => setShowNewOrderModal(true)}
            className="rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
          >
            <i className="fas fa-plus mr-2"></i>Новый заказ
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Стол №{order.tableNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {order.guests} гостей • {order.createdAt}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    order.status === "active"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "ready"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status === "active"
                    ? "Активен"
                    : order.status === "ready"
                    ? "Готов"
                    : "Завершен"}
                </span>
              </div>

              <div className="mb-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{item.price * item.quantity} ₽</span>
                  </div>
                ))}
                <div className="mt-2 border-t pt-2 text-right">
                  <span className="text-lg font-semibold">
                    Итого: {calculateTotal(order.items)} ₽
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {order.status === "active" && (
                  <button
                    onClick={() => handleStatusChange(order.id, "ready")}
                    className="rounded-lg bg-green-50 px-3 py-1 text-sm text-green-600 hover:bg-green-100"
                  >
                    Готов к подаче
                  </button>
                )}
                {order.status === "ready" && (
                  <button
                    onClick={() => handleStatusChange(order.id, "completed")}
                    className="rounded-lg bg-gray-50 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    Завершить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Новый заказ
            </h2>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Номер стола
                  </label>
                  <input
                    type="number"
                    name="tableNumber"
                    value={newOrder.tableNumber}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, tableNumber: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Количество гостей
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={newOrder.guests}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, guests: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Меню
                </label>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAddItem(item)}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
                    >
                      <span>{item.name}</span>
                      <span>{item.price} ₽</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Выбранные блюда
                </label>
                <div className="mt-2 space-y-2">
                  {newOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-2"
                    >
                      <span>{item.name}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="rounded-full bg-gray-200 px-2 py-1 text-sm"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="rounded-full bg-gray-200 px-2 py-1 text-sm"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-2 text-red-500"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowNewOrderModal(false);
                    setNewOrder({ tableNumber: "", guests: "", items: [] });
                    setError(null);
                  }}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreateOrder}
                  className="rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                >
                  Создать заказ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;