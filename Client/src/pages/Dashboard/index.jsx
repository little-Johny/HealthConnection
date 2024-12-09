import { Link, useNavigate } from 'react-router-dom';
import { IoChevronBackOutline, IoPerson  } from 'react-icons/io5';
import { useAuth } from  '../../hooks/useAuth';

const Dashboard = () => {
    const navigate = useNavigate();  // Hook para navegar
    const  { rol} = useAuth();

    return (
        <div className='min-h-screen bg-gray-100'>
            <header className='bg-orange-400 p-6 shadow-lg shadow-gray-500'>
                {/* Contenedor flexible para el botón y el título */}
                <div className='flex justify-between items-center'>
                    {/* Botón para regresar a la página anterior */}
                    <button
                        onClick={() => navigate(-1)}  // Regresar a la página anterior
                        className='bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 focus:outline-none transition ease-in-out duration-300'
                    >
                        <IoChevronBackOutline size={24} />
                    </button>

                    <h1 className='text-white text-3xl font-semibold flex-grow text-center'>
                        Panel de {rol ? rol.charAt(0).toUpperCase() + rol.slice(1) : 'Administrador'}
                    </h1>

                    <button
                        onClick={() => navigate('/admin-profile')}  // Regresar a la página anterior
                        className='bg-slate-400 text-white p-2 rounded-full hover:bg-slate-600 focus:outline-none transition ease-in-out duration-300'
                    >
                        <IoPerson size={24} />
                    </button>
                </div>
            </header>


            <main className='p-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {/* Opción 1: Registrar Paciente */}
                    <Link to='/paciente-register' className='bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-gray-50 transition transform hover:scale-105'>
                        <h2 className='text-orange-400 text-2xl font-semibold mb-3'>Registrar Paciente</h2>
                        <p className='text-gray-600'>Añadir un nuevo paciente al sistema.</p>
                    </Link>

                    {/* Opción 2: Registrar Doctor */}
                    <Link to='/register-doctor' className='bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-gray-50 transition transform hover:scale-105'>
                        <h2 className='text-indigo-600 text-2xl font-semibold mb-3'>Registrar Doctor</h2>
                        <p className='text-gray-600'>Registrar un nuevo doctor en el sistema.</p>
                    </Link>

                    {/* Opción 3: Registrar Personal Administrativo */}
                    <Link to='/register-staff' className='bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-gray-50 transition transform hover:scale-105'>
                        <h2 className='text-indigo-600 text-2xl font-semibold mb-3'>Registrar Personal Administrativo</h2>
                        <p className='text-gray-600'>Añadir personal administrativo al sistema.</p>
                    </Link>

                    {/* Opción 4: Gestionar Usuarios */}
                    <Link to='/manage-users' className='bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-gray-50 transition transform hover:scale-105'>
                        <h2 className='text-orange-400 text-2xl font-semibold mb-3'>Gestionar Usuarios</h2>
                        <p className='text-gray-600'>Ver información de los usuarios.</p>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
