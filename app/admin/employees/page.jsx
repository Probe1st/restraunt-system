"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      role: "waiter",
      status: "active",
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria@example.com",
      role: "cook",
      status: "active",
    },
    {
      id: 3,
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "waiter",
      status: "inactive",
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "waiter",
  });
  const [error, setError] = useState(null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            Access Denied
          </h1>
          <p className="mb-6 text-gray-600">
            Only administrators can access this page
          </p>
          <a
            href="/dashboard"
            className="inline-block rounded-lg bg-[#357AFF] px-6 py-3 text-white hover:bg-[#2E69DE]"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email) {
      setError("Please fill in all required fields");
      return;
    }

    const newId = employees.length + 1;
    setEmployees([
      ...employees,
      { ...newEmployee, id: newId, status: "active" },
    ]);
    setShowAddModal(false);
    setNewEmployee({ name: "", email: "", role: "waiter" });
    setError(null);
  };

  const handleStatusChange = (employeeId) => {
    setEmployees(
      employees.map((emp) => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            status: emp.status === "active" ? "inactive" : "active",
          };
        }
        return emp;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Management
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
          >
            <i className="fas fa-plus mr-2"></i>Add Employee
          </button>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-4 text-gray-600">Name</th>
                  <th className="pb-4 text-gray-600">Email</th>
                  <th className="pb-4 text-gray-600">Role</th>
                  <th className="pb-4 text-gray-600">Status</th>
                  <th className="pb-4 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b last:border-0">
                    <td className="py-4">{employee.name}</td>
                    <td className="py-4">{employee.email}</td>
                    <td className="py-4 capitalize">{employee.role}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          employee.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleStatusChange(employee.id)}
                        className={`rounded-lg px-3 py-1 text-sm ${
                          employee.status === "active"
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {employee.status === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Add New Employee
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={newEmployee.role}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, role: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                >
                  <option value="waiter">Waiter</option>
                  <option value="cook">Cook</option>
                </select>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                  }}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  className="rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                >
                  Add Employee
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