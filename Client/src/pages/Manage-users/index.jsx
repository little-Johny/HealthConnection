import  { useEffect, useState } from 'react';
import axios from 'axios';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/health_connection/v1/user/getAll'); // Cambia la URL según sea necesario
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
        return <div className="text-center py-4">Cargando usuarios...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold text-center mb-6">Gestión de Usuarios</h1>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border border-gray-300 px-4 py-2">ID</th>
                            <th className="border border-gray-300 px-4 py-2">Nombre de Usuario</th>
                            <th className="border border-gray-300 px-4 py-2">Correo</th>
                            <th className="border border-gray-300 px-4 py-2">Rol</th>
                            <th className="border border-gray-300 px-4 py-2">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.correo}</td>
                                <td className="border border-gray-300 px-4 py-2 capitalize">{user.rol}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {user.activo ? (
                                        <span className="text-green-600 font-bold">Activo</span>
                                    ) : (
                                        <span className="text-red-600 font-bold">Inactivo</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
