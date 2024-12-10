import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackOutline} from 'react-icons/io5';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const ProfileDoctor = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { token, logout } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [previewFoto, setPreviewFoto] = useState(null);

    // Función para obtener el perfil del doctor
    const fetchProfile = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/health_connection/v1/doctor/profileDoctor/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setData(response.data.data);
        } catch (err) {
            console.error('Error al obtener el perfil:', err.response?.data?.message || err.message);
            setError(err.response ? err.response.data.message : 'Error al obtener el perfil');
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, foto: file }));
            setPreviewFoto(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
    
        const formDataToSend = new FormData();
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }
    
        try {
            const response = await axios.patch(
                `http://localhost:3000/health_connection/v1/doctor/updateDoctor/${data.doctor.numero_documento}`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            console.log('Actualización exitosa:', response.data.message || 'Actualización completada.');
            setModalOpen(false);
            fetchProfile(); // Actualiza los datos después de una actualización exitosa
        } catch (err) {
            console.error('Error al actualizar:', err.response?.data?.message || err.message || err);
            alert('Ocurrió un error al actualizar la información. Por favor, inténtalo de nuevo.');
        }
    };
    

    const openModal = () => {
        if (data && data.doctor) {
            setFormData({
                telefono: data.doctor.telefono,
                correo: data.doctor.correo,
                horario: data.doctor.horario,
            });
            setModalOpen(true);
        } else {
            console.error('Datos del doctor no disponibles.');
        }
    };
    

    const closeModal = () => {
        setModalOpen(false);
        setPreviewFoto(null);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-orange-400 p-6 shadow-lg">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)} // Botón para regresar a la página anterior
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 focus:outline-none transition ease-in-out duration-300"
                    >
                        <IoChevronBackOutline size={24} />
                    </button>
                    <h1 className="text-white text-3xl font-semibold flex-grow text-center">
                        Perfil {data?.usuario?.rol}
                    </h1>
                    <button
                        onClick={()=> {logout()}}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-500"
                    >
                        logout
                    </button>
                </div>
            </header>

            <main className="p-8">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-6">
                        <img
                            src={data?.doctor?.foto || 'https://via.placeholder.com/150'}
                            alt="Foto del doctor"
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
                        />
                        <div>
                            <h2 className="text-3xl font-semibold">{data?.doctor?.nombres} {data?.doctor?.apellidos}</h2>
                            <p className="text-xl text-gray-600">Especialidad: {data?.doctor?.especialidad}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-2xl font-semibold text-gray-700">Detalles del Doctor</h3>
                        <div className="mt-4 space-y-2 text-lg text-gray-600">
                            <p><strong>Tipo de Documento:</strong> {data?.doctor?.tipo_documento}</p>
                            <p><strong>Número de Documento:</strong> {data?.doctor?.numero_documento}</p>
                            <p><strong>Género:</strong> {data?.doctor?.genero}</p>
                            <p><strong>Teléfono:</strong> {data?.doctor?.telefono}</p>
                            <p><strong>Correo:</strong> {data?.doctor?.correo}</p>
                            <p><strong>Horario:</strong> {data?.doctor?.horario}</p>
                            <p><strong>Fecha de Contratación:</strong> {new Date(data?.doctor?.fecha_contratacion).toLocaleDateString()}</p>
                        </div>
                        <button
                            onClick={openModal}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                        >
                            Editar Información
                        </button>
                    </div>
                </div>
            </main>

            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <form
                        className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[90vh] overflow-y-auto space-y-4"
                        onSubmit={handleUpdate}
                    >
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                            Editar Información del Doctor
                        </h2>

                        <label className="block text-gray-700">
                            Teléfono
                            <input
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border rounded"
                            />
                        </label>
                        <label className="block text-gray-700">
                            Correo
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border rounded"
                            />
                        </label>
                        <label className="block text-gray-700">
                            Horario
                            <input
                                type="text"
                                name="horario"
                                value={formData.horario}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border rounded"
                            />
                        </label>
                        <div>
                                <label className="block text-lg">Foto de perfil</label>
                                <input
                                    type="file"
                                    name="foto"
                                    accept="image/*"
                                    onChange={handleFotoChange}
                                    className="w-full p-2 border rounded-md"
                                />
                                {previewFoto && (
                                    <div className="mt-2">
                                        <p>Vista previa:</p>
                                        <img
                                            src={previewFoto}
                                            alt="Vista previa de la nueva foto"
                                            className="w-32 h-32 object-cover rounded-full mt-2"
                                        />
                                    </div>
                                )}
                                {data?.doctor?.foto && !previewFoto && (
                                    <div className="mt-2">
                                        <p>Foto actual:</p>
                                        <img
                                            src={`${data?.doctor?.foto}`}
                                            alt="Foto actual"
                                            className="w-32 h-32 object-cover rounded-full"
                                        />
                                    </div>
                                )}
                            </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            )}


        </div>
    );
};

export default ProfileDoctor;
