import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useAuth } from './../../hooks/useAuth';
import Modal from './../../components/Modal';
import Button from './../../components/Button';
import SearchBar from './../../components/SearchBar';
import MainLayout from './../../components/Layout';
import { deleteUser, getUsers } from './../../api/user';
import { getDisplayRole } from '../../utils/roleUtils';

const UserTable = () => {
    const { token, rol } = useAuth();
    const isAdmin = token && rol === 'admin';
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const getApiUsers = async (query = {}) => {
        setTableLoading(true);
        setError(null);
    
        // Calcular el offset en función de la página actual
        const offset = (page - 1) * limit;
    
        const cleanQuery = Object.fromEntries(
            Object.entries({
                ...query,
                offset, 
                limit,
            }).filter(([_, v]) => v !== "")
        );
    
        try {
            const response = await getUsers(cleanQuery);
            const users = response.data.data;
            const meta = response.data.meta;
    
            setUsers(users);
            setTotalPages(meta.totalPages || 1);
        } catch (error) {
            if (error.response?.status === 404) {
                setUsers([]);
                setError(error.response.data.message || 'No se encontraron usuarios.');
            } else {
                setError('Error al cargar los usuarios.');
                toast.error('Hubo un error al cargar la lista de usuarios.', { position: 'top-right' });
            }
        } finally {
            setTableLoading(false);
        }
    };
    
    

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getApiUsers({
                role: selectedRole,
                search: searchTerm,
            });
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, selectedRole, page]);

    const handleRoleChange = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        getApiUsers({ role });
        setPage(1);
    };

    const handleDeactivate = async (userId) => {
        if (!isAdmin) {
            toast.error('No tienes permisos para realizar esta acción.', { position: 'top-right' });
            return;
        }

        try {
            await deleteUser(userId);
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, deletedAt: new Date().toISOString() } : user
                )
            );
            closeModal();
            toast.success('Usuario desactivado exitosamente.', { position: 'top-right' });
        } catch (err) {
            console.error('Error al desactivar usuario:', err);
            toast.error('No se pudo desactivar el usuario. Inténtalo nuevamente.', { position: 'top-right' });
        }
    };

    const handlePageChange = (direction) => {
        setPage((prev) => {
            if (prev <= 0) {
                return;
            };

            const newPage = prev + direction;
            if (newPage > 0 && newPage <= totalPages) {
                return newPage;
            }
            return prev;
        });
    };

    return (
        <MainLayout className="min-h-screen bg-white">
            <header className="bg-orange-400 p-6 shadow-lg shadow-gray-500">
                <div className="flex justify-between items-center">
                    <Button
                        onClick={() => navigate(-1)}
                        className="absolute text-white p-2 rounded-full shadow-md transition"
                    >
                        <IoChevronBackOutline className="w-5 h-5" />
                    </Button>
                    <h1 className="flex-grow text-center text-white text-2xl font-semibold">
                        Lista de Usuarios
                    </h1>
                </div>
            </header>

            <div className="container mx-auto px-4 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Filtro por rol */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="roleFilter" className="text-sm font-medium">
                            Filtrar por rol:
                        </label>
                        <select
                            id="roleFilter"
                            value={selectedRole}
                            onChange={handleRoleChange}
                            className="p-2 border rounded shadow-sm"
                        >
                            <option value="">Todos</option>
                            <option value="admin">Admin</option>
                            <option value="doctor">Doctor</option>
                            <option value="patient">Paciente</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>

                    {/* Barra de búsqueda */}
                    <div className="flex-grow sm:max-w-md">
                        <SearchBar
                            placeholder="Buscar usuario por nombre de usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    getApiUsers({
                                        search: e.target.value,
                                        role: selectedRole,
                                    });
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {users.length > 0 && (
                <div className="flex justify-center mt-4 gap-2">
                    <Button
                        onClick={() => handlePageChange(-1)}
                        disabled={page === 1}
                        variant={page > 1 ? 'primary' : 'secondary'}
                        className='p-4'
                        >
                        Anterior
                    </Button>
                
                    <span className="px-4 py-2">{`Página ${page} de ${totalPages}`}</span>
                
                    <Button
                        onClick={() => handlePageChange(1)}
                        disabled={page === totalPages}
                        variant={page < totalPages ? 'primary' : 'secondary'}
                        className='p-4'
                    >
                        Siguiente
                    </Button>
                </div>
            
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="overflow-x-auto shadow-md rounded-lg bg-white">
                    {tableLoading ? (
                        <div className="flex justify-center items-center p-10 text-gray-500">
                            Cargando usuarios...
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center p-10 text-red-500">
                            {error}
                        </div>
                    ) : (
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
                                {users.length === 0 && !tableLoading ? (
                                    <tr>
                                        <td colSpan='6' className='text-center py-4 text-gray-400'>
                                            {error || 'No se encontraron usuarios.'}
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-100 transition">
                                            <td className="px-4 py-2">{user.id}</td>
                                            <td className="px-4 py-2">{user.username}</td>
                                            <td className="px-4 py-2">{user.email}</td>
                                            <td className="px-4 py-2 capitalize">{getDisplayRole(user.role)}</td>
                                            <td className="px-4 py-2">
                                                {!user.deletedAt ? (
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
                                                    console.log("ID del usuario al hacer clic:", user.id);  // Ver el valor de user.id
                                                    navigate(`/profile/${user.id}`);
                                                }}
                                                className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-400 transition"
                                            >
                                                Ver
                                            </button>

                                                <button
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setSelectedUser(user);
                                                    }}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-400 transition"
                                                >
                                                    Desactivar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedUser && (
                <Modal
                    isOpen={showModal}
                    onClose={closeModal}
                    onConfirm={() => handleDeactivate(selectedUser.id)}
                    type="confirm"
                    title="Eliminar usuario"
                    message={`¿Estás seguro de que deseas eliminar a ${selectedUser.username}?`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                />
            )}
        </MainLayout>
    );
};

export default UserTable;
