"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [shifts, setShifts] = useState([
    {
      id: 1,
      date: "2025-01-15",
      startTime: "09:00",
      endTime: "17:00",
      employees: ["John Smith", "Maria Garcia"],
      status: "scheduled",
    },
    {
      id: 2,
      date: "2025-01-15",
      startTime: "17:00",
      endTime: "23:00",
      employees: ["Alex Johnson"],
      status: "scheduled",
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShift, setNewShift] = useState({
    date: "",
    startTime: "",
    endTime: "",
    employees: [],
  });
  const [error, setError] = useState(null);
  const [availableEmployees] = useState([
    "John Smith",
    "Maria Garcia",
    "Alex Johnson",
  ]);

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

  const handleAddShift = () => {
    if (
      !newShift.date ||
      !newShift.startTime ||
      !newShift.endTime ||
      newShift.employees.length === 0
    ) {
      setError(
        "Please fill in all required fields and select at least one employee"
      );
      return;
    }

    const newId = shifts.length + 1;
    setShifts([...shifts, { ...newShift, id: newId, status: "scheduled" }]);
    setShowAddModal(false);
    setNewShift({ date: "", startTime: "", endTime: "", employees: [] });
    setError(null);
  };

  const handleEmployeeSelection = (employee) => {
    setNewShift((prev) => ({
      ...prev,
      employees: prev.employees.includes(employee)
        ? prev.employees.filter((e) => e !== employee)
        : [...prev.employees, employee],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Shift Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
          >
            <i className="fas fa-plus mr-2"></i>Add Shift
          </button>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-4 text-gray-600">Date</th>
                  <th className="pb-4 text-gray-600">Time</th>
                  <th className="pb-4 text-gray-600">Employees</th>
                  <th className="pb-4 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr key={shift.id} className="border-b last:border-0">
                    <td className="py-4">{shift.date}</td>
                    <td className="py-4">{`${shift.startTime} - ${shift.endTime}`}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        {shift.employees.map((employee, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                          >
                            {employee}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        {shift.status}
                      </span>
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
              Add New Shift
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={newShift.date}
                  onChange={(e) =>
                    setNewShift({ ...newShift, date: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={newShift.startTime}
                    onChange={(e) =>
                      setNewShift({ ...newShift, startTime: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={newShift.endTime}
                    onChange={(e) =>
                      setNewShift({ ...newShift, endTime: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Employees
                </label>
                <div className="mt-2 space-y-2">
                  {availableEmployees.map((employee, index) => (
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="employees"
                        checked={newShift.employees.includes(employee)}
                        onChange={() => handleEmployeeSelection(employee)}
                        className="rounded border-gray-300 text-[#357AFF] focus:ring-[#357AFF]"
                      />
                      <span className="text-gray-700">{employee}</span>
                    </label>
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
                    setShowAddModal(false);
                    setError(null);
                  }}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddShift}
                  className="rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                >
                  Add Shift
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