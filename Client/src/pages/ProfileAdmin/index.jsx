import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useAuth } from '../../hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify'; // Importar toast

const ProfileAdmin = () => {
    const { userId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [previewFoto, setPreviewFoto] = useState(null);

    const validFields = {
        foto: 'foto',
        telefono: 'telefono',
        correo: 'correo',
        horario: 'horario',
    };

    const documentTypes = ['c.c', 't.i', 'c.e', 'r.c'];

    // Función para obtener los datos del administrador
    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/health_connection/v1/administrativos/profileAdministrativo/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUserData(response.data.data);
        } catch (err) {
            console.error('Error al obtener los datos:', err.response?.data?.message || err.message);
            setError(err.response ? err.response.data.message : 'Error al obtener los datos');
            toast.error(err.response?.data?.message || 'Hubo un error al cargar los datos del administrador.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUser();
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
                `http://localhost:3000/health_connection/v1/administrativos/updateAdministrativo/${userData?.personal?.numero_documento}`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            toast.success(response.data.message || 'Datos del administrador actualizados correctamente.');
            setModalOpen(false);
            fetchUser(); // Recarga los datos actualizados
        } catch (err) {
            console.error('Error al actualizar:', err.response?.data?.message || err.message || err);
            toast.error(err.response?.data?.message || 'Ocurrió un error al actualizar los datos.');
        }
    };

    const openModal = () => {
        if (userData && userData.personal) {
            setFormData({
                foto: userData.personal.foto,
                telefono: userData.personal.telefono,
                correo: userData.personal.correo,
                horario: userData.personal.horario
            });
            setPreviewFoto(userData.personal.foto); // Para mostrar la foto previa
            setModalOpen(true);
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
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500"
                    >
                        <IoChevronBackOutline size={24} />
                    </button>
                    <h1 className="text-white text-3xl font-semibold flex-grow text-center">
                        Perfil del {userData?.usuario?.rol}
                    </h1>
                </div>
            </header>

            <main className="p-8">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-6">
                        <img
                            src={userData?.personal?.foto || 'https://via.placeholder.com/150'}
                            alt="Foto del administrador"
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
                        />
                        <div>
                            <h2 className="text-3xl font-semibold">{userData?.personal?.nombres} {userData?.personal?.apellidos}</h2>
                            <p className="text-xl text-gray-600">Rol: {userData?.usuario?.rol}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-2xl font-semibold text-gray-700">Detalles del Administrador</h3>
                        <div className="mt-4 space-y-2 text-lg text-gray-600">
                            <p><strong>Tipo de Documento:</strong> {userData?.personal?.tipo_documento}</p>
                            <p><strong>Número de Documento:</strong> {userData?.personal?.numero_documento}</p>
                            <p><strong>Teléfono:</strong> {userData?.personal?.telefono}</p>
                            <p><strong>Correo:</strong> {userData?.personal?.correo}</p>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <form
                        className="bg-white p-6 rounded-lg shadow-lg w-1/3"
                        onSubmit={handleUpdate}
                    >
                        <h2 className="text-2xl font-semibold mb-4">Editar Información del Administrador</h2>

                        {/* Form fields */}
                        {Object.entries(validFields).map(([field, label]) => (
                            field !== 'foto' ? (
                                field === 'tipo_documento' ? (
                                    <label key={field} className="block">
                                        Tipo de Documento
                                        <select
                                            name={field}
                                            value={formData[field] || ''}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 p-2 border rounded"
                                        >
                                            {documentTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </label>
                                ) : (
                                    <label key={field} className="block">
                                        {label.charAt(0).toUpperCase() + label.slice(1)}
                                        <input
                                            type={field === 'correo' ? 'email' : 'text'}
                                            name={field}
                                            value={formData[field] || ''}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 p-2 border rounded"
                                        />
                                    </label>
                                )
                            ) : null
                        ))}

                        {/* Foto */}
                        <label className="block">
                            Foto
                            <input
                                type="file"
                                name="foto"
                                accept="image/*"
                                onChange={handleFotoChange}
                                className="w-full mt-1 p-2 border rounded"
                            />
                            {previewFoto && <img src={previewFoto} alt="Vista previa" className="w-24 h-24 mt-2 rounded-full" />}
                        </label>

                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="bg-gray-300 px-4 py-2 rounded mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default ProfileAdmin;
