import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getSpecialityById } from "./../../api/speciality";


export default function AppointmentCard({ appointment }) {
    const [specialityName, setSpecialityName] = useState('');

    const getApiSpecialities = async () => {
        try {
            const response = await getSpecialityById(appointment.specialityId);
            setSpecialityName(response.data.data.name);
        } catch (error) {
            toast.error('No se pudieron cargar las especialidades');
        }
    };

    useEffect(() => {
        getApiSpecialities();
    }, []);

    const STATUS_OPTIONS = [
        { value: 'pending', label: 'Pendiente' },
        { value: 'confirmed', label: 'Confirmada' },
        { value: 'completed', label: 'Completada' },
        { value: 'canceled', label: 'Cancelada' }
    ];    

    return (
        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl mx-auto mt-6 text-gray-700">
            <h2 className="text-lg font-semibold mb-1">
                Paciente: {appointment.patient.user.name} {appointment.patient.user.lastName}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
                Doctor: {appointment.doctor.user.name} {appointment.doctor.user.lastName}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Especialidad</label>
                    <span className="font-medium">{specialityName}</span>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Doctor</label>
                    <p>{appointment.doctor.user.name} {appointment.doctor.user.lastName}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Fecha</label>
                    <p>{appointment.date}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Hora</label>
                    <p>{appointment.startTime} - {appointment.endTime}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Precio</label>
                    <p>${appointment.price}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                        ${
                            appointment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : appointment.status === 'confirmed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : appointment.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                        }`}>
                        {STATUS_OPTIONS.find(opt => opt.value === appointment.status)?.label}
                    </span>
                </div>
            </div>
        </div>
    );
}
