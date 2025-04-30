import { useNavigate, useParams } from "react-router-dom";
import { partiallyUpdateClinicalHistory, getClinicalHistoryById } from "./../../api/clinicalHistory";
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

    useEffect(() => {
        getClinicalHistory(clinicalHistoryId);
    }, [clinicalHistoryId]);

    const updateHandler = async (data) => {
        try {
            const response = await partiallyUpdateClinicalHistory(clinicalHistory.id, data);
            setClinicalHistory(response.data.data);
            toast.success("Historial clinico actualizado correctamente");
        } catch (error) {
            console.error('No se pudo actualizar el historial clinico', error);
            toast.error('No se pudo actualizar el historial clinico');
        }
    };

    return (
        <MainLayout LayoutClass="bg-gray-100 ">
            <header className="bg-orange-500 p-6 shadow-lg rounded-lg mb-6">
                <div className="flex justify-between items-center">
                    <Button
                        onClick={() => navigate(-1)}
                        className="text-white p-2 rounded-full shadow-md transition transform hover:scale-110"
                    >
                        <IoChevronBackOutline className="w-5 h-5" />
                    </Button>

                    <h1 className="text-white text-3xl font-semibold flex-grow text-center">
                        Historial Clínico
                    </h1>

                    <Button
                        onClick={() => navigate('/profile')}
                        className="bg-slate-400 text-white p-2 rounded-full hover:bg-slate-600"
                    >
                        <IoPerson size={24} />
                    </Button>
                </div>
            </header>

            {clinicalHistory ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <ClinicalHistoryCard
                        clinicalHistory={clinicalHistory}
                        isEditable={rol !== 'patient'}
                        onSave={updateHandler}
                    />
                    {/* Agregar Observación Button */}
                    {rol !== 'patient' && (
                        <div className="mt-8 text-center">
                            <Button
                                onClick={() => navigate(`/add-observation/${clinicalHistoryId}`)}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transform transition-all duration-300 hover:scale-105"
                            >
                                Agregar Observación
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-center mt-10 text-gray-500">Cargando historial clínico...</p>
            )}
        </MainLayout>
    );
}
