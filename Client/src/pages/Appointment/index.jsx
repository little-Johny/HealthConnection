import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from './../../hooks/useAuth';
import { getAppointmentById, partiallyUpdateAppointment } from './../../api/appointment';
import MainLayout from './../../components/Layout';
import AppointmentCard from './../../components/AppointmentCard';
import Button from './../../components/Button';
import { IoChevronBackOutline, IoPerson } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import AppointmentEditForm from '../../components/AppointmentEditForm';

export default function Appointment() {
    const { rol } = useAuth();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { appointmentId } = useParams();

    const getAppointment = async (id) => {
        try {
            const response = await getAppointmentById(id);
            const appointment = response.data.data;
            setAppointment(appointment);
        } catch (error) {
            toast.error('No se pudo cargar la cita');
        }  
    };

    useEffect(()=> {
        getAppointment(appointmentId);
    }, [appointmentId]);

    const handleUpdate = async (updatedData) => {
        try {
            const response = await partiallyUpdateAppointment(appointment.id, updatedData);
            setAppointment(response.data.data);
            toast.success('Cita actualizada correctamente');
            setShowModal(false);
        } catch (error) {
            console.error(`No se pudo actualizar la cita`, error);
            toast.error('No se pudo actualizar la cita');
        }
    }

    return (
        <MainLayout LayoutClass='bg-gray-300'>
            <header className='bg-orange-400 p-6 shadow-lg shadow-gray-500'>
                <div className='flex justify-between items-center'>
                    <Button
                        onClick={() => navigate(-1)}
                        className="absolute text-white p-2 rounded-full shadow-md transition"
                    >
                        <IoChevronBackOutline className="w-5 h-5" />
                    </Button>

                    <h1 className='text-white text-3xl font-semibold flex-grow text-center'>
                        Historial Clinico
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
                    
                {appointment ? (
                    <AppointmentCard
                        appointment={appointment}
                    />
                ) : (
                    <div className="flex justify-center items-center h-screen">
                        <CircularProgress />
                    </div>
                )}

            
                    {rol !== 'patient' && (
                        <Button
                            onClick={() => setShowModal(true)}
                            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Editar Cita
                        </Button>
                    )}
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
                        <AppointmentEditForm appointment={appointment} onSubmit={handleUpdate} />
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
