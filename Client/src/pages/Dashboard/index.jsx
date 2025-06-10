import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoChevronBackOutline, IoPerson } from 'react-icons/io5';
import { useAuth } from './../../hooks/useAuth';
import MainLayout from './../../components/Layout';
import Button from './../../components/Button';
import { getDisplayRole } from './../../utils/roleUtils';
import { getAllPost } from '../../api/post'; // Asegúrate de que esté bien importado
import PostCard from '../../components/PostCard'; // Ajusta la ruta según tu estructura

const Dashboard = () => {
    const navigate = useNavigate();
    const { rol, isLoading, logout} = useAuth();
    const [posts, setPosts] = useState([]);

    const getPost = async () => {
    try {
        const response = await getAllPost();
        const allPosts = response.data.data;
        const lastTenPosts = allPosts.slice().reverse().slice(0, 10);
        setPosts(lastTenPosts);
    } catch (error) {
        console.error(error);
    }
}


    useEffect(() => {
        getPost();
    }, []);

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-600">Cargando panel...</p>
                </div>
            </MainLayout>
        );
    }

    const displayRol = getDisplayRole(rol) || 'Admin';

    return (
        <MainLayout LayoutClass='bg-gray-200'>
            <header className='bg-orange-400 p-6 shadow-lg shadow-gray-500'>
                <div className='flex justify-between items-center'>
                <Button
                    onClick={() => {
                        logout();            // Llama la función logout
                        navigate(-1);        // Va una página atrás en el historial
                    }}
                    className="absolute text-white p-2 rounded-full shadow-md transition"
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
                    {/* Tarjetas del panel */}
                    {rol !== 'patient' && (
                    <Link to='/manage-users' className='dashboard-card'>
                        <img
                            src='https://cdn-icons-png.freepik.com/512/12669/12669701.png' 
                            alt='Gestionar Usuarios'
                            className='w-full h-32 object-cover rounded-xl mb-4'
                        />
                        <h2>Gestionar Usuarios</h2>
                        <p>Ver información de los usuarios.</p>
                    </Link>
                    )}

                    {rol === 'admin' && (
                    <>
                        <Link to='/register' className='dashboard-card'>
                            <img
                                src='https://w7.pngwing.com/pngs/869/794/png-transparent-computer-icons-registered-user-login-user-profile-others-blue-logo-registered-user-thumbnail.png' 
                                alt='Crear Usuario'
                                className='w-full h-32 object-cover rounded-xl mb-4'
                            />
                            <h2>Registrar Nuevo Usuario</h2>
                            <p>Añadir nuevo usuario.</p>
                        </Link>
                        <Link to='/add-post' className='dashboard-card'>
                        <img
                            src='https://cdn-icons-png.flaticon.com/512/8896/8896503.png' 
                            alt='Crear publicaciones'
                            className='w-full h-32 object-cover rounded-xl mb-4'
                        />
                            <h2>Crea una nueva publicacion</h2>
                            <p>Agrega publicaciones</p>
                        </Link>
                        <Link to='/manage-post' className='dashboard-card'>
                        <img
                            src='https://cdn-icons-png.flaticon.com/512/4199/4199802.png' 
                            alt='Gestionar Publicaciones'
                            className='w-full h-32 object-cover rounded-xl mb-4'
                        />
                            <h2>Publicaciones</h2>
                            <p>Administra las publicaciones</p>
                        </Link>
                    </>
                    )}

                    {rol !== 'doctor' && (
                    <Link to='/create-appointment' className='dashboard-card'>
                        <img
                            src='https://cdn-icons-png.flaticon.com/512/1572/1572663.png' 
                            alt='Crear cita'
                            className='w-full h-32 object-cover rounded-xl mb-4'
                        />
                        <h2>Solicita una cita</h2>
                        <p>Agenda tu cita.</p>
                    </Link>
                    )}

                    <Link to='/manage-appointment' className='dashboard-card'>
                        <img
                            src='https://www.shutterstock.com/image-vector/appointment-line-design-scheduling-calendar-600nw-2525793589.jpg' 
                            alt='Gestionar Citas'
                            className='w-full h-32 object-cover rounded-xl mb-4'
                        />
                        <h2>Ver citas</h2>
                        <p>Ve historial de citas.</p>
                    </Link>

                    {rol === 'doctor' && (
                    <>

                        <Link to='/schedule' className='dashboard-card'>
                        <img
                            src='https://w7.pngwing.com/pngs/593/822/png-transparent-computer-icons-calendar-date-time-rally-miscellaneous-blue-text.png' 
                            alt='Ver Horario'
                            className='w-full h-32 object-cover rounded-xl mb-4'
                        />
                        <h2>Consultar mi horario</h2>
                        <p>Revisa tu horario</p>
                        </Link>
                    </>
                    )}

                    {rol !== 'patient' && (
                    <Link to='/create-schedule' className='dashboard-card '>
                        <img
                            src='https://medifolios.net/img/iconos/Personaliza_AGENDA.png' 
                            alt='Gestionar Horario doctor'
                            className='w-full h-32 bg-gray-100 rounded-xl mb-4 object-contain'
                        />
                        <h2>Crear horario</h2>
                        <p>Define tu horario para cada día</p>
                    </Link>
                    )}
                </div>
                </div>
            </main>

            {/* Sección de publicaciones */}
            <section className="p-8 pt-4 max-w-6xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
                    Últimas publicaciones
                </h2>
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No hay publicaciones aún.</p>
                )}
            </section>
        </MainLayout>
    );
};

export default Dashboard;
