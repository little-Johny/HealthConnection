import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';

const UserTable = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Cierra el modal y resetea el usuario seleccionado
    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/health_connection/v1/user/getAll');
                setUsers(response.data.users);
            } catch (err) {
                setError('Error al cargar los usuarios');
                toast.error('Hubo un error al cargar la lista de usuarios.', { position: 'top-right' });
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDeactivate = async (userId) => {
        if (!token) {
            toast.error('No tienes permisos para realizar esta acción.', { position: 'top-right' });
            return;
        }

        try {
            await axios.patch(
                `http://localhost:3000/health_connection/v1/user/desactivacion/${userId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, activo: false } : user
                )
            );
            closeModal();
            toast.success('Usuario desactivado exitosamente.', { position: 'top-right' });
        } catch (err) {
            console.error('Error al desactivar usuario:', err);
            toast.error('No se pudo desactivar el usuario. Inténtalo nuevamente.', { position: 'top-right' });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-gray-500 text-lg font-medium">Cargando usuarios...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-red-500 text-lg font-semibold">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-orange-400 shadow-md py-4">
                <div className="container mx-auto px-4 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-400 focus:ring-2 focus:ring-blue-300 transition"
                        aria-label="Volver"
                    >
                        <IoChevronBackOutline size={24} />
                    </button>
                    <h1 className="flex-grow text-center text-white text-2xl font-semibold">
                        Lista de Usuarios
                    </h1>
                </div>
            </header>

            {/* Tabla */}
            <div className="container mx-auto px-4 py-8">
                <div className="overflow-x-auto shadow-md rounded-lg bg-white">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-indigo-600 text-white text-left text-sm font-medium uppercase">
                                <th className="px-4 py-3 border-b">ID</th>
                                <th className="px-4 py-3 border-b">Nombre de Usuario</th>
                                <th className="px-4 py-3 border-b">Correo</th>
                                <th className="px-4 py-3 border-b">Rol</th>
                                <th className="px-4 py-3 border-b">Estado</th>
                                <th className="px-4 py-3 border-b">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-100 transition">
                                    <td className="px-4 py-2">{user.id}</td>
                                    <td className="px-4 py-2">{user.username}</td>
                                    <td className="px-4 py-2">{user.correo}</td>
                                    <td className="px-4 py-2 capitalize">{user.rol}</td>
                                    <td className="px-4 py-2">
                                        {user.activo ? (
                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                                                Inactivo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => {
                                                // Redirige según el rol del usuario
                                                if (user.rol === 'paciente') {
                                                    navigate(`/paciente-profile/${user.id}`);
                                                } else if (user.rol === 'doctor') {
                                                    navigate(`/doctor-profile/${user.id}`);
                                                } else {
                                                    navigate(`/admin-profile/${user.id}`); // Ruta por defecto para otros roles
                                                }
                                            }}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-400 transition"
                                            aria-label={`Ver perfil de ${user.username}`}
                                        >
                                            Ver
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowModal(true);
                                                setSelectedUser(user);
                                            }}
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-400 transition"
                                            aria-label={`Desactivar a ${user.username}`}
                                        >
                                            Desactivar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Confirmación */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            Confirmar Desactivación
                        </h2>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro de que deseas desactivar al usuario{' '}
                            <span className="font-bold">{selectedUser.username}</span>?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDeactivate(selectedUser.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Desactivar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default UserTable;
