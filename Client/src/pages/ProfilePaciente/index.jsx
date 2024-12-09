import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useAuth } from '../../hooks/useAuth'; // Hook de autenticación

const UserPaciente = () => {
    const { userId } = useParams(); // Capturar el parámetro de la URL
    const { token } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Agregar useNavigate

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/health_connection/v1/paciente/profilePaciente/${userId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,  // Agregar el token en los headers
                        }
                    }
                );
                setUserData(response.data.data); // Guardar los datos de la respuesta
            } catch (err) {
                // Verificamos si hay un error específico
                if (err.response) {
                    setError(`Error al cargar los datos: ${err.response.data.message || 'Error desconocido'}`);
                } else {
                    setError('Error al conectar con el servidor');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, token]);

    // Mientras se cargan los datos
    if (loading) return <div className="text-center py-4 text-gray-500">Cargando perfil...</div>;

    // Si ocurre un error al cargar los datos
    if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

    // Si no hay datos del usuario
    if (!userData) return <div className="text-center py-4">No se encontraron datos del usuario.</div>;

    const { paciente = {}, usuario = {} } = userData; // Datos del paciente y usuario con valores por defecto

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <header className="bg-amber-600 shadow-lg py-4 mb-8">
                <div className="container mx-auto px-4 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-500 p-3 rounded-full text-white hover:bg-blue-400 focus:ring-2 focus:ring-blue-300 transition"
                    >
                        <IoChevronBackOutline size={24} />
                    </button>
                    <h1 className="flex-grow text-center text-white text-2xl font-semibold">
                        Perfil del Paciente
                    </h1>
                </div>
            </header>
            
            {/* Foto de perfil */}
            <div className="flex justify-center mb-6">
                <img
                    src={paciente.foto || 'default-foto-url.jpg'} // URL por defecto si no hay foto
                    alt="Foto de perfil"
                    className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500 shadow-xl"
                />
            </div>

            {/* Información personal */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Información Personal</h2>
                <p><strong>Nombre de Usuario:</strong> {usuario.username}</p>
                <p><strong>Rol:</strong> {usuario.rol}</p>
                <p><strong>Género:</strong> {paciente.genero === 'masculino' ? 'Masculino' : 'Femenino'}</p>
                <p><strong>Fecha de Nacimiento:</strong> {new Date(paciente.fecha_nacimiento).toLocaleDateString()}</p>
                <p><strong>Tipo de Documento:</strong> {paciente.tipo_documento}</p>
                <p><strong>Número de Documento:</strong> {paciente.numero_documento}</p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Contacto</h2>
                <p><strong>Correo:</strong> {paciente.correo}</p>
                <p><strong>Teléfono:</strong> {paciente.telefono}</p>
                <p><strong>Dirección:</strong> {paciente.direccion}</p>
                <p><strong>Ciudad:</strong> {paciente.ciudad}</p>
            </div>
        </div>
    );
};

export default UserPaciente;
