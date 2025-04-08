// components/admin/EmployeesSection.tsx
"use client";

import { useState } from "react";
import AddEmployeeModal from "./AddEmployeeModal";

export default function EmployeesSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employees, setEmployees] = useState([]);

    const handleFireEmployee = async (employeeId) => {
        // API call to update employee status
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                    Управление сотрудниками
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Добавить сотрудника
                </button>
            </div>

            <table className="w-full">
                <thead>
                    <tr className="text-left border-b">
                        <th className="pb-3">Имя</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Роль</th>
                        <th className="pb-3">Статус</th>
                        <th className="pb-3">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id} className="border-b">
                            <td className="py-3">{employee.name}</td>
                            <td className="py-3">{employee.email}</td>
                            <td className="py-3">{employee.role}</td>
                            <td className="py-3">
                                <span
                                    className={`px-2 py-1 rounded ${
                                        employee.status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {employee.status === "active"
                                        ? "Активен"
                                        : "Уволен"}
                                </span>
                            </td>
                            <td className="py-3">
                                {employee.status === "active" && (
                                    <button
                                        onClick={() =>
                                            handleFireEmployee(employee.id)
                                        }
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Уволить
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={(newEmployee) =>
                    setEmployees([...employees, newEmployee])
                }
            />
        </div>
    );
}
