import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { getAppointments, deleteAppointment } from "../../api/appointment";
import { getUserProfile } from '../../api/user';
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/Button";
import SearchBar from '../../components/SearchBar';
import MainLayout from "../../components/Layout";
import Modal from '../../components/Modal';

export default function AppointmentTable() {
    const navigate = useNavigate();
    const { token, rol, userId } = useAuth();
    const isAdmin = token && (rol === 'admin' || rol === 'staff');
    const isDoctor = token && rol === 'doctor';
    const isPatient = token && rol === 'patient';

    const [appointments, setAppointments] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const closeModal = () => {
        setShowModal(false);
        setSelectedAppointment(null);
    };

    const getApiAppointments = useCallback(async (query = {}) => {
        setTableLoading(true);
        setError(null);
        const offset = (page - 1) * limit;
        const cleanQuery = Object.fromEntries(
            // eslint-disable-next-line no-unused-vars
            Object.entries({ ...query, offset, limit }).filter(([_, v]) => v !== "")
        );

        try {
            const response = await getAppointments(cleanQuery);
            const { appointments, meta } = response.data.data;
            setAppointments(appointments);
            setTotalPages(meta.pages);
        } catch (err) {
            console.error("Error al cargar citas:", err);
            if (err.response?.status === 404) {
                setAppointments([]);
                setError(err.response.data.message || 'No se encontraron citas.');
            } else {
                setError('Error al cargar las citas.');
                toast.error('Hubo un error al cargar la lista de citas.');
            }
        } finally {
            setTableLoading(false);
        }
    }, [page, limit]);

    const getUserAppointments = useCallback(async () => {
        try {
            const profile = await getUserProfile(userId);
            const name = profile?.data?.data?.user?.name;
            if (!name) throw new Error('Usuario inválido');
            await getApiAppointments({ patient: name, status: selectedStatus });
        } catch (error) {
            console.error("Error al obtener citas del paciente:", error);
            toast.error('No se pudieron cargar tus citas.');
        }
    }, [userId, selectedStatus, getApiAppointments]);

    const getDoctorAppointments = useCallback(async () => {
        try {
            const profile = await getUserProfile(userId);
            const name = profile?.data?.data?.user?.name;
            if (!name) throw new Error('Usuario inválido');
            await getApiAppointments({ doctor: name, status: selectedStatus });
        } catch (error) {
            console.error("Error al obtener citas del doctor:", error);
            toast.error('No se pudieron cargar tus citas.');
        }
    }, [userId, selectedStatus, getApiAppointments]);

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        setPage(1);
    };

    const handleCancel = async (id) => {
        try {
            await deleteAppointment(id);
            toast.success('Cita cancelada');
            if (isAdmin) {
                getApiAppointments({ status: selectedStatus, date: searchTerm });
            } else if (isDoctor) {
                getDoctorAppointments();
            } else if (isPatient) {
                getUserAppointments();
            }
        } catch (error) {
            console.error("Error al cancelar la cita:", error);
            toast.error('No se pudo cancelar la cita');
        } finally {
            closeModal();
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAdmin) {
                getApiAppointments({ status: selectedStatus, date: searchTerm });
            } else if (isDoctor) {
                getDoctorAppointments();
            } else if (isPatient) {
                getUserAppointments();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [selectedStatus, searchTerm, page, isAdmin, isDoctor, isPatient, getApiAppointments, getDoctorAppointments, getUserAppointments]);

    const handlePageChange = (dir) => {
        setPage(prev => {
            const newPage = prev + dir;
            return newPage > 0 && newPage <= totalPages ? newPage : prev;
        });
    };

    return (
        <MainLayout className="min-h-screen bg-white">
            <header className="bg-orange-400 p-6 shadow-lg shadow-gray-500">
                <div className="flex items-center justify-center relative">
                    <Button onClick={() => navigate(-1)} className="absolute left-6 text-white p-2 rounded-full shadow-md">
                        <IoChevronBackOutline className="w-5 h-5" />
                    </Button>
                    <h1 className="text-center text-white text-2xl font-semibold">Lista de Citas</h1>
                </div>
            </header>

            <div className="container mx-auto px-4 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Filtrar por estado:</label>
                    <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="p-2 border rounded shadow-sm"
                    >
                        <option value="">Todos</option>
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="canceled">Cancelada</option>
                        <option value="completed">Completada</option>
                    </select>
                </div>

                {isAdmin && (
                    <div className="flex-grow sm:max-w-md">
                        <SearchBar
                            placeholder="Buscar por fecha..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && getApiAppointments({ status: selectedStatus, date: searchTerm })}
                        />
                    </div>
                )}
            </div>

            {appointments.length > 0 && (
                <div className="flex justify-center mt-4 gap-2">
                    <Button
                        onClick={() => handlePageChange(-1)}
                        disabled={page === 1}
                        variant={page > 1 ? 'primary' : 'secondary'}
                        className="p-4"
                    >
                        Anterior
                    </Button>
                    <span className="px-4 py-2">{`Página ${page} de ${totalPages}`}</span>
                    <Button
                        onClick={() => handlePageChange(1)}
                        disabled={page === totalPages}
                        variant={page < totalPages ? 'primary' : 'secondary'}
                        className="p-4"
                    >
                        Siguiente
                    </Button>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="overflow-x-auto shadow-md rounded-lg bg-white">
                    {tableLoading ? (
                        <div className="p-10 text-center text-gray-500">Cargando citas...</div>
                    ) : error ? (
                        <div className="p-10 text-center text-red-500">{error}</div>
                    ) : (
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-indigo-600 text-white text-left text-sm font-medium uppercase">
                                    <th className="px-4 py-3 border-b">ID</th>
                                    <th className="px-4 py-3 border-b">Paciente</th>
                                    <th className="px-4 py-3 border-b">Doctor</th>
                                    <th className="px-4 py-3 border-b">Fecha</th>
                                    <th className="px-4 py-3 border-b">Estado</th>
                                    <th className="px-4 py-3 border-b">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {appointments.map(appt => (
                                    <tr key={appt.id} className="hover:bg-gray-100 transition">
                                        <td className="px-4 py-2">{appt.id}</td>
                                        <td className="px-4 py-2">
                                            {appt.patient?.user?.name ?? 'Paciente'} {appt.patient?.user?.lastName ?? 'Desconocido'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {appt.doctor?.user?.name ?? 'Doctor'} {appt.doctor?.user?.lastName ?? 'Desconocido'}
                                        </td>
                                        <td className="px-4 py-2">{appt.date}</td>
                                        <td className="px-4 py-2 capitalize">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm ${
                                                    appt.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : appt.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 space-x-2">
                                            <button
                                                onClick={() => navigate(`/appointment/${appt.id}`)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-400"
                                            >
                                                Ver
                                            </button>
                                            {appt.status === 'pending' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedAppointment(appt);
                                                        setShowModal(true);
                                                    }}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-400"
                                                >
                                                    Cancelar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showModal && selectedAppointment && (
                <Modal
                    title="Cancelar Cita"
                    message="¿Estás seguro de que deseas cancelar esta cita?"
                    onConfirm={() => handleCancel(selectedAppointment.id)}
                    onCancel={closeModal}
                />
            )}
        </MainLayout>
    );
}
