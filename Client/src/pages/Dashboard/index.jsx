import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoChevronBackOutline, IoPerson } from 'react-icons/io5';
import { useAuth } from './../../hooks/useAuth';
import MainLayout from './../../components/Layout';
import Button from './../../components/Button';
import { getDisplayRole } from './../../utils/roleUtils';

const Dashboard = () => {
    const navigate = useNavigate();
    const { rol, userId, isLoading } = useAuth();

    useEffect(() => {
        console.log('ROL EN DASHBOARD:', rol);
    }, [rol]);

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-screen">
                    <p className="text-lg text-gray-600">Cargando panel...</p>
                </div>
            </MainLayout>
        );
    }

    const displayRol = getDisplayRole(rol) || 'Admin'

    return (
        <MainLayout >
            <header className='bg-orange-400 p-6 shadow-lg shadow-gray-500'>
                <div className='flex justify-between items-center'>
                    <Button
                        onClick={() => navigate(-1)}
                        className="absolute  text-white p-2 rounded-full shadow-md transition"
                    >
                        <IoChevronBackOutline className="w-5 h-5" />
                    </Button>

                    <h1 className='text-white text-3xl font-semibold flex-grow text-center'>
                        Panel de {displayRol}
                    </h1>

                    <button
                        onClick={() => navigate(`/profile`)}
                        className='bg-slate-400 text-white p-3 rounded-full hover:bg-slate-600'
                    >
                        <IoPerson size={24} />
                    </button>
                </div>
            </header>

            <main className='p-8'>
                <div className='flex justify-center'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl'>

                        {rol === 'admin' && (
                            <>
                                <Link to='/register' className='dashboard-card'>
                                    <h2>Registrar Nuevo Usuario</h2>
                                    <p>Añadir nuevo usuario.</p>
                                </Link>

                                <Link to='/manage-users' className='dashboard-card'>
                                    <h2>Gestionar Usuarios</h2>
                                    <p>Ver información de los usuarios.</p>
                                </Link>
                            </>
                        )}

                        {rol !== 'doctor' && (
                            <Link to={`/solicitar-cita/${userId}`} className='dashboard-card'>
                                <h2>Solicita una cita</h2>
                                <p>Agenda tu cita.</p>
                            </Link>
                        )}

                        {rol === 'paciente' && (
                            <Link to='/mis-citas' className='dashboard-card'>
                                <h2>Mis citas</h2>
                                <p>Ve tu historial de citas.</p>
                            </Link>
                        )}

                        {rol === 'doctor' && (
                            <Link to='/agenda-doctor' className='dashboard-card'>
                                <h2>Mi Agenda</h2>
                                <p>Ve tu agenda de citas.</p>
                            </Link>
                        )}

                    </div>
                </div>
            </main>
        </MainLayout>
    );
};

export default Dashboard;
