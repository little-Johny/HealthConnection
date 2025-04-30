import React from 'react';

export default function DoctorSchedule({ schedule }) {
    if (!schedule || schedule.length === 0) {
        return <p className="text-center text-gray-500">Este doctor no tiene horarios registrados.</p>;
    }

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const daysInSpanish = {
        Monday: 'Lunes',
        Tuesday: 'Martes',
        Wednesday: 'Miércoles',
        Thursday: 'Jueves',
        Friday: 'Viernes',
        Saturday: 'Sábado',
        Sunday: 'Domingo',
    };

    const sortedSchedule = [...schedule].sort(
        (a, b) => daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek)
    );

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl mt-6">
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Horario del Doctor</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sortedSchedule.map(({ id, dayOfWeek, startTime, endTime }) => (
                    <div key={id} className="border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {daysInSpanish[dayOfWeek] || dayOfWeek}
                        </h3>
                        <p className="text-gray-600">
                            <span className="font-medium">Inicio:</span> {startTime}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Fin:</span> {endTime}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
