import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackOutline, IoExit  } from 'react-icons/io5';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth'; // Hook de autenticación

const ProfileAdmin = () => {
    const navigate = useNavigate();
    const { token,logout } = useAuth(); // Obtener el token desde el contexto de autenticación
    const [data, setData] = useState(null);  // Estado para almacenar los datos del perfil
    const [loading, setLoading] = useState(true);  // Estado de carga
    const [error, setError] = useState(null);  // Estado para los errores
    const [modalOpen, setModalOpen] = useState(false);  // Estado para controlar la visibilidad del modal
    const [formData, setFormData] = useState({
        telefono: '',
        correo: '',
        horario: '',
        foto: null, // Para almacenar la nueva foto seleccionada
    });  // Datos del formulario de actualización
    const [formError, setFormError] = useState(null); // Estado para errores del formulario
    const [previewFoto, setPreviewFoto] = useState(null); // Estado para la vista previa de la foto

    // Función para obtener el perfil del usuario
    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:3000/health_connection/v1/administrativos/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Agregar el token en los headers
                }
            });
            setData(response.data.data);  // Guardar los datos del perfil
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error al obtener el perfil');
        } finally {
            setLoading(false);
        }
    };

    // Obtener el perfil cuando el token cambie
    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token]);

    // Mostrar cargando o error
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    // Función para manejar el cierre del modal
    const closeModal = () => {
        setModalOpen(false);
        setFormError(null); // Limpiar errores del formulario
        setFormData({
            telefono: data?.personal?.telefono || '',
            correo: data?.personal?.correo || '',
            horario: data?.personal?.horario || '',
            foto: null, // Limpiar el campo de la foto
        });
        setPreviewFoto(null); // Limpiar la vista previa de la foto
    };

    // Función para abrir el modal e inicializar los datos
    const openModal = () => {
        setModalOpen(true);
        setFormData({
            telefono: data?.personal?.telefono || '',
            correo: data?.personal?.correo || '',
            horario: data?.personal?.horario || '',
            foto: null, // Limpiar el campo de la foto
        });
        setFormError(null); // Limpiar errores previos
    };

    // Función para manejar el cambio de datos en el formulario
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Función para manejar el cambio de la foto
    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                foto: file,
            });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewFoto(reader.result); // Establecer la vista previa de la foto seleccionada
            };
            reader.readAsDataURL(file);
        }
    };

    // Función para manejar el envío de los datos de actualización
    const handleUpdate = async (e) => {
        e.preventDefault();

        // Validación de campos vacíos
        if (!formData.telefono.trim() || !formData.correo.trim() || !formData.horario.trim()) {
            setFormError('Todos los campos son obligatorios.');
            return;
        }

        const formDataToSend = new FormData();

        // Agregar los datos del formulario al FormData
        formDataToSend.append('telefono', formData.telefono);
        formDataToSend.append('correo', formData.correo);
        formDataToSend.append('horario', formData.horario);
        if (formData.foto) {
            formDataToSend.append('foto', formData.foto); // Agregar la nueva foto si fue seleccionada
        }

        try {
            const response = await axios.patch('http://localhost:3000/health_connection/v1/administrativos/editProfile', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Importante para enviar el FormData
                }
            });
            setData(response.data.data);
            closeModal();
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error al actualizar el perfil');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-amber-600 p-6 shadow-lg shadow-gray-500">
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
                        onClick={openModal} 
                        className="bg-green-600 text-white p-2 rounded-full hover:bg-green-500 focus:outline-none transition ease-in-out duration-300"
                    >
                        Editar
                    </button>
                    <button
                            onClick={logout}
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-500 focus:outline-none transition ease-in-out duration-300"
                    >
                        <IoExit size={24}/>
                    </button>
                </div>
            </header>

            <main className="p-8">
                {/* Mostrar el perfil del usuario */}
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center space-x-6">
                        <img
                            src={data?.personal?.foto || 'https://via.placeholder.com/150'}
                            alt="Foto de perfil"
                            className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
                        />
                        <div>
                            <h2 className="text-3xl font-semibold text-gray-800">{data?.personal?.nombres} {data?.personal?.apellidos}</h2>
                            <p className="text-xl text-gray-500">{data?.usuario?.rol}</p>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <h3 className="text-2xl font-semibold text-gray-700">Información adicional</h3>
                        <div className="space-y-2 text-lg text-gray-600">
                            <p><strong>Tipo de Documento:</strong> {data?.personal?.tipo_documento}</p>
                            <p><strong>Número de Documento:</strong> {data?.personal?.numero_documento}</p>
                            <p><strong>Género:</strong> {data?.personal?.genero}</p>
                            <p><strong>Teléfono:</strong> {data?.personal?.telefono}</p>
                            <p><strong>Correo:</strong> {data?.personal?.correo}</p>
                            <p><strong>Horario de Trabajo:</strong> {data?.personal?.horario}</p>
                            <p><strong>Fecha de Contratación:</strong> {new Date(data?.personal?.fecha_contratacion).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal para editar datos */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-2xl font-semibold mb-4">Editar Información</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-lg">Teléfono</label>
                                <input
                                    type="text"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-lg">Correo</label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-lg">Horario de Trabajo</label>
                                <input
                                    type="text"
                                    name="horario"
                                    value={formData.horario}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>

                            {/* Foto de perfil */}
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
                                {data?.personal?.foto && !previewFoto && (
                                    <div className="mt-2">
                                        <p>Foto actual:</p>
                                        <img
                                            src={`${data?.personal?.foto}`}
                                            alt="Foto actual"
                                            className="w-32 h-32 object-cover rounded-full"
                                        />
                                    </div>
                                )}
                            </div>

                            {formError && <p className="text-red-500">{formError}</p>} {/* Mensaje de error */}

                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileAdmin;
