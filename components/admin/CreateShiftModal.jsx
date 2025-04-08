// components/admin/CreateShiftModal.tsx
"use client";

import { useState, useEffect } from "react";

export default function CreateShiftModal({ isOpen, onClose, onCreate }) {
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    // Загрузка списка сотрудников при открытии модального окна
    useEffect(() => {
        if (isOpen) {
            const fetchEmployees = async () => {
                try {
                    const response = await fetch("/api/employees");
                    const data = await response.json();
                    setEmployees(data);
                } catch (error) {
                    console.error("Error fetching employees:", error);
                }
            };
            fetchEmployees();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!startDateTime || !endDateTime) {
            alert("Пожалуйста, заполните все обязательные поля");
            setLoading(false);
            return;
        }

        try {
            onCreate({
                start: startDateTime,
                end: endDateTime,
                employeeIds: selectedEmployees,
            });
            onClose();
        } catch (error) {
            console.error("Error creating shift:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                <h2 className="text-xl font-semibold mb-4">
                    Создать новую смену
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Начало смены *
                            <input
                                type="datetime-local"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={startDateTime}
                                onChange={(e) =>
                                    setStartDateTime(e.target.value)
                                }
                                required
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Окончание смены *
                            <input
                                type="datetime-local"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={endDateTime}
                                onChange={(e) => setEndDateTime(e.target.value)}
                                min={startDateTime}
                                required
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Сотрудники на смене
                            <select
                                multiple
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-32"
                                value={selectedEmployees}
                                onChange={(e) =>
                                    setSelectedEmployees(
                                        Array.from(
                                            e.target.selectedOptions,
                                            (option) => option.value,
                                        ),
                                    )
                                }
                            >
                                {employees.map((employee) => (
                                    <option
                                        key={employee.id}
                                        value={employee.id}
                                        className="p-2 hover:bg-blue-50"
                                    >
                                        {employee.name} ({employee.role})
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-gray-500 mt-1">
                                Используйте Ctrl/Cmd для выбора нескольких
                                сотрудников
                            </p>
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            disabled={loading}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? "Создание..." : "Создать смену"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
