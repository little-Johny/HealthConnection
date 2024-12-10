import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth"; // Importa el hook useAuth
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PacietneCitas = () => {
    const navigate = useNavigate();
    const { userId } = useAuth(); // Suponiendo que userId se obtiene desde el hook useAuth
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            toast.error("No se pudo obtener el ID del paciente.");
            return;
        }

        const fetchCitas = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/health_connection/v1/cita/pacienteCita/${userId}`);
                if (response.data.success) {
                    setCitas(response.data.data);
                } else {
                    toast.error("No se pudieron obtener las citas.");
                }
            } catch (error) {
                console.error("Error al obtener las citas:", error);
                toast.error("Error al obtener las citas. Intente más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchCitas();
    }, [userId]);

    if (loading) {
        return <div className="text-center py-6">Cargando citas...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Encabezado */}
            <header className="bg-orange-400 p-6 shadow-lg">
                <div className="flex items-center space-x-4">
                    {/* Botón para regresar a la página anterior */}
                    <button
                        onClick={() => navigate(-1)} // Regresar a la página anterior
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-500 focus:outline-none transition ease-in-out duration-300"
                    >
                        <IoChevronBackOutline size={24} />
                    </button>

                    {/* Título centrado */}
                    <h1 className="text-white text-3xl font-semibold flex-grow text-center">
                        Mis Citas
                    </h1>
                </div>
            </header>

            {/* Contenido principal */}
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
                {citas.length === 0 ? (
                    <p className="text-center text-gray-600">No tienes citas programadas.</p>
                ) : (
                    <div className="space-y-6">
                        {citas.map((cita) => (
                            <div key={cita.id} className="border p-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200">
                                <h3 className="text-xl font-medium text-gray-800">{`${cita.doctor_nombre} ${cita.doctor_apellido}`}</h3>
                                <p className="text-gray-600"><strong>Tipo de cita:</strong> {cita.tipo_cita}</p>
                                <p className="text-gray-600"><strong>Fecha:</strong> {new Date(cita.fecha).toLocaleDateString()}</p>
                                <p className="text-gray-600"><strong>Hora:</strong> {cita.hora}</p>
                                <p className="text-gray-600"><strong>Costo:</strong> ${cita.costo}</p>
                                <p className="text-gray-600"><strong>Requiere autorización:</strong> {cita.requiere_autorizacion ? "Sí" : "No"}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Toast Container para notificaciones */}
            <ToastContainer />
        </div>
    );
};

export default PacietneCitas;
