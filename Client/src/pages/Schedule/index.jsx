import { useEffect, useState } from 'react';
import MainLayout from '../../components/Layout';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { IoChevronBackOutline, IoPerson } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getScheduleByDoctorId, partiallyUpdateSchedule } from '../../api/schedule';
import { toast } from 'react-toastify';
import DoctorSchedule from '../../components/DoctorSchedule';
import { getUserProfile } from '../../api/user';
import ScheduleForm from '../../components/ScheduleForm';

export default function Schedule() {
    const navigate = useNavigate();
    const [doctId, setDoctId] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [scheduleMap, setScheduleMap] = useState({}); // Nuevo estado para almacenar el mapeo
    const { doctorId } = useParams();
    const { userId, rol, token } = useAuth();
    const isAdmin = token && rol === 'admin';

    const getDoctorIdFromToken = async () => {
        try {
            const response = await getUserProfile(userId);
            console.log("Doctor info from token:", response.data);
            setDoctId(response.data.data.doctor.id);
        } catch (error) {
            toast.error('No se pudo obtener el doctor');
            console.error("Error getting doctor info:", error);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            if (!isAdmin) {
                await getDoctorIdFromToken(); // Establece doctId
            }
        };
        initialize();
    }, [isAdmin, userId]);
    
    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            console.log("Fetching schedule for doctorId:", doctorId, "or doctId:", doctId);
            try {
                let response;
                if (isAdmin) {
                    console.log("Fetching schedule for admin");
                    response = await getScheduleByDoctorId(Number(doctorId));
                } else if (doctId) {
                    console.log("Fetching schedule for user doctorId");
                    response = await getScheduleByDoctorId(Number(doctId));
                } else {
                    console.log("Doctor ID not available yet");
                    return; // doctId aún no disponible
                }
    
                console.log("Fetched schedule data:", response.data.data);

                // Mapeamos la data para obtener un objeto con `dayOfWeek` como clave
                const scheduleData = response.data.data;
                console.log(typeof response.data.data);
                const map = scheduleData.reduce((acc, item) => {
                    acc[item.dayOfWeek] = item;
                    return acc;
                }, {});

                
                if (Array.isArray(scheduleData)) {
                    setSchedule(scheduleData);
                    // Resto del mapeo
                } else {
                    toast.error("Datos de horario no válidos");
                    setLoading(false);
                }
                
                setScheduleMap(map); // Guardamos el mapeo
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener el Horario:", error);
                toast.error("No se pudo cargar el Horario");
                setLoading(false);
            }
        };
    
        fetchSchedule();
    }, [doctorId, doctId, isAdmin]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    };

    const handleUpdate = async (updatedData) => {
        const scheduleId = scheduleMap[updatedData.dayOfWeek]?.id; // Obtener el `id` usando el mapeo
        if (!scheduleId) {
            toast.error("Horario no encontrado.");
            return;
        }
    
        // Elimina `doctorId` si está en los datos, ya que no debería enviarse
        const { doctorId, ...dataToUpdate } = updatedData;
    
        try {
            console.log("Updating schedule with ID:", scheduleId, "and data:", dataToUpdate);
            const response = await partiallyUpdateSchedule(scheduleId, dataToUpdate);
            console.log("Updated schedule response:", response.data);
            
            /* // Asegurarte de que la data sigue siendo un arreglo
            if (Array.isArray(response.data.data)) {
                setSchedule(response.data.data);
            } else {
                toast.error("Respuesta de horario no válida.");
            } */
    
            toast.success('Horario actualizado exitosamente');
            setShowModal(false);
        } catch (error) {
            console.error("Error al actualizar horario:", error);
            toast.error("Error al actualizar el horario");
        }
    };
    
    

    return (
        <MainLayout LayoutClass="bg-gray-300">
            <header className='bg-orange-400 p-6 shadow-lg shadow-gray-500'>
                <div className='flex justify-between items-center'>
                    <Button
                        onClick={() => navigate(-1)}
                        className="absolute text-white p-2 rounded-full shadow-md transition"
                    >
                        <IoChevronBackOutline className="w-5 h-5" />
                    </Button>

                    <h1 className='text-white text-3xl font-semibold flex-grow text-center'>
                        Horario
                    </h1>

                    <Button
                        onClick={() => navigate('/profile')}
                        className='bg-slate-400 text-white p-2 rounded-full hover:bg-slate-600'
                    >
                        <IoPerson size={24} />
                    </Button>
                </div>
            </header>

            <div className="flex justify-center px-4 py-8">
                <div className="w-full max-w-lg">
                    <DoctorSchedule schedule={schedule} />

                    <Button
                        onClick={() => setShowModal(true)}
                        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Editar
                    </Button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                            onClick={() => setShowModal(false)}
                        >
                            ✕
                        </button>
                        <ScheduleForm schedule={schedule} onSubmit={handleUpdate} />
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
