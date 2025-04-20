import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSpecialityById } from "./../../api/speciality";
import { getDisplayRole } from "./../../utils/roleUtils";
import { getPatientById } from "./../../api/patient";
import Button from "../Button";

export default function UserCard({ user }) {
    const [specialityName, setSpecialityName] = useState('');
    const [patient, setPatient] = useState(null);
    const navigate = useNavigate();

    const getDoctorSpeciality = async(specialityId) => {
        try {
            const response = await getSpecialityById(specialityId);
            const speciality = response.data.data.name;
            setSpecialityName(speciality);
        } catch (error) {
            console.log(error);
        }
    };

    const getPatient = async (patientId) => {
        try {
            const response = await getPatientById(patientId);
            setPatient(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(user?.doctor?.specialityId) {
            getDoctorSpeciality(user.doctor.specialityId)
        }
        if(user?.patient?.id) {
            getPatient(user.patient.id)
        }
    }, [user]);

    const isActive = user.deletedAt === null; 

    return (
        <div className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl p-6 w-full max-w-xl relative transform hover:scale-105 mt-6">
            {/* Rol */}
            <span className="absolute top-4 right-4 bg-indigo-100 text-indigo-600 px-3 py-1 text-xs rounded-full font-medium capitalize">
                {getDisplayRole(user.role)}
            </span>

            {/* Foto y nombre de usuario */}
            <div className="flex items-center gap-4 mb-6 relative">
                <div className="avatar">
                    <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
                        <img
                            src={user.photo || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                            alt="Foto de perfil"
                            className="w-full h-full object-cover"
                        />
                        {/* Indicador de estado del usuario */}
                        <div className={`absolute bottom-0 left-16 w-4 h-4 rounded-full border-2 border-white ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{user.username}</h2>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
            </div>

            {/* Información general */}
            <div className="space-y-3 text-sm text-gray-700">
                <p><span className="font-medium">Nombre completo:</span> {user.name} {user.lastName}</p>
                <p><span className="font-medium">Documento:</span> {user.typeDocument}: {user.numberDocument}</p>
                <p>
                    <span className="font-medium">Género:</span>{' '}
                    {user.gender === 'Male' ? 'Masculino' : 'Femenino'}
                </p>
                <p><span className="font-medium">Teléfono:</span> {user.phone}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
            </div>

            {/* Info específica de Roles */}
            {(user.patient || user.doctor) && (
                <div className="mt-6 border-t pt-4">
                    {user.patient && (
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-grey-600 mb-2">Información del paciente</h3>
                            <p><span className="font-medium">Fecha de nacimiento:</span> {new Date(user.patient.birthdate).toLocaleDateString('es-CO')}</p>
                            <p><span className="font-medium">Dirección:</span> {user.patient.address}</p>
                            <p><span className="font-medium">Ciudad:</span> {user.patient.city}</p>
                            <Button
                                variant="primary"
                                className='p-4'
                                onClick={() => {
                                    if (patient?.clinical_history === null) {
                                        navigate(`/create-clinical-history/${patient.id}`);
                                    } else {
                                        navigate(`/clinical-history/${patient.clinical_history.id}`);
                                    }
                                }}
                            >
                                {patient?.clinical_history === null? 'Crear historial clínico' : 'Ver historial clínico' }
                            </Button>
                        </div>
                    )}

                    {user.doctor && (
                        <div>
                            <h3 className="text-lg font-semibold text-grey-600 mb-2">Información del doctor</h3>
                            <p><span className="font-medium">Especialidad:</span> {specialityName}</p>
                            <p><span className="font-medium">Licencia:</span> {user.doctor.licenseNumber}</p>
                            <p><span className="font-medium">Tarifa de consulta:</span> ${user.doctor.consultationFee}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
