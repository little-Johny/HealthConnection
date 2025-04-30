import React from 'react'
import MainLayout from '../../components/Layout'
import Button from '../../components/Button'
import { IoChevronBackOutline } from 'react-icons/io5'
import ObservationForm from '../../components/ObservationForm'
import { useNavigate, useParams } from 'react-router-dom'
import { createObservation } from '../../api/observation'
import { toast } from 'react-toastify'

export default function CreateObservation() {
    const navigate = useNavigate();
    const { clinicalHistoryId } = useParams();

    const handleSubmit = async (values) => {
        try {
            const finalValues = {
                ...values,
                clinicalHistoryId: parseInt(clinicalHistoryId, 10), // asegura que sea un número
            };
    
            await createObservation(finalValues);
            toast.success('Observación creada exitosamente');
            navigate(`/clinical-history/${clinicalHistoryId}`);
        } catch (error) {
            toast.error('Hubo un error al crear la observación');
            console.log(error);
        }
    };
    
    return (
        <MainLayout containerClass='flex justify-center items-center px-4 py-6'>
            <Button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 bg-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition"
                aria-label="Volver"
            >
                <IoChevronBackOutline className="w-5 h-5" />
            </Button>
            <ObservationForm onSubmit={handleSubmit} observation={null}/>
        </MainLayout>
    )
}
