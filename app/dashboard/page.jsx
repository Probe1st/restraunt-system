"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            Access Denied
          </h1>
          <p className="mb-6 text-gray-600">
            Please sign in to access the dashboard
          </p>
          <a
            href="/account/signin"
            className="inline-block rounded-lg bg-[#357AFF] px-6 py-3 text-white hover:bg-[#2E69DE]"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (user?.role) {
      case "admin":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-2 text-lg font-semibold">Total Orders</h3>
                <p className="text-3xl font-bold text-[#357AFF]">150</p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-2 text-lg font-semibold">Revenue</h3>
                <p className="text-3xl font-bold text-[#357AFF]">$3,250</p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-2 text-lg font-semibold">Active Staff</h3>
                <p className="text-3xl font-bold text-[#357AFF]">8</p>
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-semibold">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">New Order #123</p>
                    <p className="text-sm text-gray-500">Table 5</p>
                  </div>
                  <span className="text-sm text-gray-500">5 min ago</span>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Order #122 Completed</p>
                    <p className="text-sm text-gray-500">Table 3</p>
                  </div>
                  <span className="text-sm text-gray-500">15 min ago</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "waiter":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-4 text-xl font-semibold">Active Orders</h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="flex justify-between">
                      <p className="font-medium">Table 4</p>
                      <span className="text-[#357AFF]">In Progress</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      2 items • 15 min ago
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="flex justify-between">
                      <p className="font-medium">Table 7</p>
                      <span className="text-[#357AFF]">Ready to Serve</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      3 items • 20 min ago
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-4 text-xl font-semibold">Tables Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((table) => (
                    <div
                      key={table}
                      className="rounded-lg bg-gray-100 p-4 text-center"
                    >
                      <p className="font-medium">Table {table}</p>
                      <p className="mt-2 text-sm text-gray-600">
                        {table % 2 === 0 ? "Occupied" : "Available"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "cook":
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-semibold">Kitchen Orders</h3>
              <div className="space-y-4">
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #124</p>
                      <p className="mt-1 text-sm text-gray-600">2 items</p>
                    </div>
                    <span className="rounded-full bg-orange-100 px-4 py-1 text-sm text-orange-600">
                      New
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">- Chicken Pasta x1</p>
                    <p className="text-sm text-gray-600">- Caesar Salad x1</p>
                  </div>
                </div>
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #123</p>
                      <p className="mt-1 text-sm text-gray-600">3 items</p>
                    </div>
                    <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm text-yellow-600">
                      In Progress
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">- Grilled Salmon x2</p>
                    <p className="text-sm text-gray-600">- Mushroom Soup x1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <p className="text-xl text-gray-600">
              No content available for this role
            </p>
          </div>
        );
    }
  };

  const role = user?.role || "User";
  const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Restaurant Dashboard
              </h1>
              <div className="hidden space-x-4 md:flex">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === "dashboard"
                      ? "text-[#357AFF]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === "orders"
                      ? "text-[#357AFF]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Orders
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden text-sm text-gray-600 md:inline">
                {user.email}
              </span>
              <a
                href="/account/logout"
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">
            {roleDisplay} Dashboard
          </h2>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}

export default MainComponent;