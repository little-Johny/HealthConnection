import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const UserTable = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/health_connection/v1/user/getAll');
                setUsers(response.data.users);
            } catch (err) {
                setError('Error al cargar los usuarios');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

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
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => navigate(`/paciente-profile/${user.id}`)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-400 transition"
                                        >
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
