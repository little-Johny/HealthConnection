import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Importa el hook useAuth
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoChevronBackOutline } from "react-icons/io5";

const CreateCita = () => {
    const navigate = useNavigate();
    const { rol } = useAuth(); // Obtenemos los datos del usuario logueado
    const { userId } = useParams(); // userId de la URL, en caso de estar en una ruta dinámica
    const isAdmin = rol === "administrador";

    const [formData, setFormData] = useState({
        paciente_id: isAdmin ? "" : userId, // Si es admin, permite editar, de lo contrario usa el ID del usuario logueado
        doctor_id: "",
        tipo_cita_id: "",
        fecha: "",
        hora: "",
        costo: "",
        requiere_autorizacion: false,
    });

    const [doctors, setDoctors] = useState([]);
    const [tiposCita, setTiposCita] = useState([]);
    const [loading, setLoading] = useState(false);

    // Cargar doctores y tipos de cita dinámicamente
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [doctorsResponse, tiposCitaResponse] = await Promise.all([
                    axios.get("http://localhost:3000/health_connection/v1/doctor/getActive"),
                    axios.get("http://localhost:3000/health_connection/v1/cita/tipoCita"),
                ]);

                setDoctors(doctorsResponse.data.data.doctores);
                setTiposCita(tiposCitaResponse.data.data);
            } catch (err) {
                console.error("Error al cargar las opciones:", err);
                toast.error("Error al cargar los datos. Intente más tarde.");
            }
        };

        fetchOptions();
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "tipo_cita_id") {
            // Actualizar el costo basado en el tipo de cita seleccionado
            const selectedTipo = tiposCita.find((tipo) => tipo.id.toString() === value);
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                costo: selectedTipo ? selectedTipo.costo_adicional : "",
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:3000/health_connection/v1/cita/registerCita/${formData.paciente_id}`,
                formData
            );
            toast.success("Cita registrada exitosamente");
            console.log("Respuesta del servidor:", response.data);
            setFormData({
                paciente_id: isAdmin ? "" : userId,
                doctor_id: "",
                tipo_cita_id: "",
                fecha: "",
                hora: "",
                costo: "",
                requiere_autorizacion: false,
            });
        } catch (err) {
            console.error("Error al registrar la cita:", err);
            toast.error("Error al registrar la cita. Intente de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header ocupa todo el ancho */}
            <header className="w-full bg-orange-400 p-6 shadow-lg shadow-gray-500">
                <div className="flex justify-between items-center">
                    {/* Botón para regresar a la página anterior */}
                    <button
                        onClick={() => navigate(-1)} // Regresar a la página anterior
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-500 focus:outline-none transition ease-in-out duration-300"
                    >
                        <IoChevronBackOutline size={24} />
                    </button>

                    {/* Título centrado */}
                    <h1 className="text-white text-3xl font-semibold text-center flex-grow">
                        Solicita cita
                    </h1>
                </div>
            </header>

            {/* Contenedor principal */}
            <div className="flex-grow max-w-full mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isAdmin && (
                        <div>
                            <label htmlFor="paciente_id" className="block text-gray-700 font-medium">
                                ID del Paciente:
                            </label>
                            <input
                                type="number"
                                id="paciente_id"
                                name="paciente_id"
                                value={formData.paciente_id}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="doctor_id" className="block text-gray-700 font-medium">
                            Doctor:
                        </label>
                        <select
                            id="doctor_id"
                            name="doctor_id"
                            value={formData.doctor_id}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">Seleccione un doctor</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.doctorId} value={doctor.doctorId}>
                                    {`${doctor.nombres} ${doctor.apellidos} - ${doctor.especialidad}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="tipo_cita_id" className="block text-gray-700 font-medium">
                            Tipo de Cita:
                        </label>
                        <select
                            id="tipo_cita_id"
                            name="tipo_cita_id"
                            value={formData.tipo_cita_id}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">Seleccione un tipo de cita</option>
                            {tiposCita.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="fecha" className="block text-gray-700 font-medium">
                            Fecha:
                        </label>
                        <input
                            type="date"
                            id="fecha"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="hora" className="block text-gray-700 font-medium">
                            Hora:
                        </label>
                        <input
                            type="time"
                            id="hora"
                            name="hora"
                            value={formData.hora}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="costo" className="block text-gray-700 font-medium">
                            Costo:
                        </label>
                        <input
                            type="number"
                            id="costo"
                            name="costo"
                            value={formData.costo}
                            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            readOnly
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition"
                    >
                        {loading ? "Registrando..." : "Registrar Cita"}
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default CreateCita;
