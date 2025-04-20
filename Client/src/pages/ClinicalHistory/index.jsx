import { useNavigate, useParams } from "react-router-dom"
import { partiallyUpdateClinicalHistory, getClinicalHistoryById } from "./../../api/clinicalHistory"
import MainLayout from "./../../components/Layout";
import Button from "../../components/Button";
import ClinicalHistoryCard from "./../../components/ClinicalHistoryCard";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoChevronBackOutline, IoPerson } from "react-icons/io5";

export default function ClinicalHistory() {
    const navigate = useNavigate();
    const [clinicalHistory, setClinicalHistory] = useState();
    const { rol } = useAuth();
    const { clinicalHistoryId } = useParams();

    const getClinicalHistory = async (id) => {
        try {
            const response = await getClinicalHistoryById(id);
            const clinicalHistory = response.data.data;
            setClinicalHistory(clinicalHistory);
        } catch (error) {
            toast.error('No se pudo cargar el historial clinico');
        }
    };

    useEffect(()=> {
        getClinicalHistory(clinicalHistoryId);
    }, [clinicalHistoryId]);

    const updateHandler = async (data) => {
        try {
            const response = await partiallyUpdateClinicalHistory(clinicalHistory.id, data);
            setClinicalHistory(response.data.data);
            toast.success("Perfil actualizado correctamente");
        } catch (error) {
            console.error('No se pudo actualizar el historial clinico', error);
            toast.error('No se pudo actualizar el historial clinico');
        }
    }

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
            {clinicalHistory ? (
                <ClinicalHistoryCard
                clinicalHistory={clinicalHistory}
                isEditable={rol !== 'patient'}
                onSave={updateHandler}
                />
            ) : (
                <p className="text-center mt-10 text-gray-500">Cargando historial clínico...</p>
            )}
            </MainLayout>
    );
}
