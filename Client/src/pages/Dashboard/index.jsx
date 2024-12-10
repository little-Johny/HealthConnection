import { Link, useNavigate } from 'react-router-dom';
import { IoChevronBackOutline, IoPerson } from 'react-icons/io5';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
    const navigate = useNavigate();
    const { rol, userId } = useAuth();

    return (
        <div className='min-h-screen bg-gray-100'>
            <header className='bg-orange-400 p-6 shadow-lg shadow-gray-500'>
                {/* Contenedor flexible para el botón y el título */}
                <div className='flex justify-between items-center'>
                    {/* Botón para regresar a la página anterior */}
                    <button
                        onClick={() => navigate(-1)} // Regresar a la página anterior
                        className='bg-blue-600 text-white p-3 rounded-full hover:bg-blue-500 focus:outline-none transition ease-in-out duration-300'
                    >
                        <IoChevronBackOutline size={24} />
                    </button>

                    <h1 className='text-white text-3xl font-semibold flex-grow text-center'>
                        Panel de {rol ? rol.charAt(0).toUpperCase() + rol.slice(1) : 'Administrador'}
                    </h1>

                    <button
                        onClick={() => {
                            // Redirige según el rol del usuario
                            if (rol === 'paciente') {
                                navigate(`/paciente-profile/${userId}`);
                            } else if (rol === 'doctor') {
                                navigate(`/doctor-profile/${userId}`);
                            } else {
                                navigate(`/admin-profile/${userId}`);
                            }
                        }}
                        className='bg-slate-400 text-white p-3 rounded-full hover:bg-slate-600 focus:outline-none transition ease-in-out duration-300'
                    >
                        <IoPerson size={24} />
                    </button>
                </div>
            </header>

            <main className='p-8'>
                {/* Contenedor centrado */}
                <div className='flex justify-center'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                        {/* Opción 1: Registrar Paciente */}
                        {(rol === 'administrador' || rol === 'asistente') && (
                            <Link
                                to='/paciente-register'
                                className='bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transition transform hover:scale-105'
                            >
                                <h2 className='text-orange-500 text-2xl font-semibold mb-3'>Registrar Paciente</h2>
                                <p className='text-gray-700'>Añadir un nuevo paciente al sistema.</p>
                            </Link>
                        )}

                        {/* Opción 2: Registrar Doctor */}
                        {(rol === 'administrador' || rol === 'asistente') && (
                            <Link
                                to='/doctor-register'
                                className='bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transition transform hover:scale-105'
                            >
                                <h2 className='text-orange-500 text-2xl font-semibold mb-3'>Registrar Doctor</h2>
                                <p className='text-gray-700'>Registrar un nuevo doctor en el sistema.</p>
                            </Link>
                        )}

                        {/* Opción 3: Registrar Personal Administrativo */}
                        {rol === 'administrador' && (
                            <Link
                                to='/administrativo-register'
                                className='bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transition transform hover:scale-105'
                            >
                                <h2 className='text-orange-500 text-2xl font-semibold mb-3'>Registrar Personal Administrativo</h2>
                                <p className='text-gray-700'>Añadir personal administrativo al sistema.</p>
                            </Link>
                        )}

                        {/* Opción 4: Gestionar Usuarios */}
                        {rol === 'administrador' && (
                            <Link
                                to='/manage-users'
                                className='bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transition transform hover:scale-105'
                            >
                                <h2 className='text-orange-500 text-2xl font-semibold mb-3'>Gestionar Usuarios</h2>
                                <p className='text-gray-700'>Ver información de los usuarios.</p>
                            </Link>
                        )}

                        {/* Opción 5: Solicitar cita */}
                        {rol !== 'doctor' && (
                            <Link
                                to={rol === 'paciente' ? `/solicitar-cita/${userId}` : `/solicitar-cita/:id`}
                                className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transition transform hover:scale-105"
                            >
                                <h2 className="text-orange-500 text-2xl font-semibold mb-3">Solicita una cita</h2>
                                <p className="text-gray-700">Agenda tu cita.</p>
                            </Link>
                        )}


                        {/* Opción 6: citas de paciente */}
                        {rol === 'paciente' && (
                            <Link
                                to='/mis-citas'
                                className='bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transition transform hover:scale-105'
                            >
                                <h2 className='text-orange-500 text-2xl font-semibold mb-3'>Mis citas</h2>
                                <p className='text-gray-700'>Ve tu historial de citas.</p>
                            </Link>
                        )}

                        {/* Opción 7: Agenda de doctor */}
                        {rol === 'doctor' && (
                            <Link
                                to='/agenda-doctor'
                                className='bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transition transform hover:scale-105'
                            >
                                <h2 className='text-orange-500 text-2xl font-semibold mb-3'>Mi Agenda</h2>
                                <p className='text-gray-700'>Ve tu agenda de citas.</p>
                            </Link>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
