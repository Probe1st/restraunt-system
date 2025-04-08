"use client";

import { useState } from "react";
import CreateShiftModal from "./CreateShiftModal";

export default function ShiftsSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shifts, setShifts] = useState([]);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Управление сменами</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Создать смену
                </button>
            </div>

            <div className="space-y-4">
                {shifts.map((shift) => (
                    <div key={shift.id} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-medium">
                                    {new Date(shift.start).toLocaleDateString()}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {new Date(shift.start).toLocaleTimeString()}{" "}
                                    - {new Date(shift.end).toLocaleTimeString()}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">
                                    {shift.employees.length} сотрудников
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <CreateShiftModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={(newShift) => setShifts([...shifts, newShift])}
            />
        </div>
    );
}
