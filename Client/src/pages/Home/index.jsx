import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout';
import Button from '../../components/Button';

const Home = () => {
    const navigate = useNavigate();

    const handleSubmit = (route) => {
        route === 'login' ? navigate('/login') : navigate('/register'); 
    };

    return (

        <MainLayout>
            {/* Barra de Navegación */}
            <nav className="bg-orange-500 py-4 shadow-md">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-white text-2xl font-bold">Health Connection</h1>
                    <div className="hidden lg:flex space-x-6">
                        <a href="#about" className="text-white hover:underline">Nosotros</a>
                        <a href="#services" className="text-white hover:underline">Servicios</a>
                        <a href="#team" className="text-white hover:underline">Equipo Médico</a>
                        <a href="#contact" className="text-white hover:underline">Contacto</a>
                    </div>
                </div>
            </nav>


            {/* Encabezado */}
            <header className="bg-orange-400 text-white text-center py-20 px-4">
                <h1 className="text-4xl font-bold">Bienvenido a Health Connection</h1>
                <p className="text-xl mt-4">Tu salud, nuestra prioridad</p>
                <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
                    <Button
                        type='submit'
                        onClick={() => handleSubmit('login')}
                        className='transition px-4'
                        variant='primary'
                    >
                        Acceder
                    </Button>
                    <Button
                        type='submit'
                        onClick={() => handleSubmit('register')}
                        className='transition px-4'
                        variant='primary'
                    >
                        Registrarse
                    </Button>
                </div>
            </header>


            {/* Sección de Nosotros */}
            <section id="about" className="py-20 bg-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-semibold">Sobre Nosotros</h2>
                    <p className="mt-4 text-lg">
                        En Health Connection, somos una clínica privada dedicada a brindar
                        servicios médicos de alta calidad con un enfoque en la atención
                        personalizada y el bienestar de nuestros pacientes.
                    </p>
                </div>
            </section>

            {/* Sección de Servicios */}
            <section id="services" className="py-20 bg-gray-300 text-center">
                <h2 className="text-3xl font-bold mb-10 text-gray-800">Nuestros Servicios</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-10">
                    <div className="bg-white shadow-xl p-6 rounded-lg hover:shadow-2xl transition">
                        <h5 className="text-xl font-bold">Consulta Médica</h5>
                        <p className="mt-3 text-gray-600">Ofrecemos consultas con especialistas...</p>
                    </div>
                    <div className="bg-white shadow-xl p-6 rounded-lg hover:shadow-2xl transition">
                        <h5 className="text-xl font-bold">Consultas cuando quieras</h5>
                        <p className="mt-3 text-gray-600">Posibilidad de solicitar una consulta cuando y como quieras</p>
                    </div>
                    <div className="bg-white shadow-xl p-6 rounded-lg hover:shadow-2xl transition">
                        <h5 className="text-xl font-bold">Doctores de la mejor calidad</h5>
                        <p className="mt-3 text-gray-600">Especialistas capacitados y dispuestos a darte su 100%</p>
                    </div>
                </div>
            </section>


            {/* Sección de Equipo Médico */}
            <section id="team" className="py-20 bg-white text-center">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-semibold mb-5">Nuestro Equipo Médico</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Miembro del equipo 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-2xl">
                            <img
                                src="/img/doctor2.png"
                                alt="Doctor 1"
                                className="w-32 h-32 mx-auto rounded-full mb-4"
                            />
                            <h3 className="font-semibold">Dr. Juan Pérez</h3>
                            <p>Cardiólogo</p>
                        </div>
                        {/* Miembro del equipo 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-2xl">
                            <img
                                src="/img/doctor2.png"
                                alt="Doctor 2"
                                className="w-32 h-32 mx-auto rounded-full mb-4"
                            />
                            <h3 className="font-semibold">Dra. María López</h3>
                            <p>Dermatóloga</p>
                        </div>
                        {/* Miembro del equipo 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-2xl ">
                            <img
                                src="/img/doctor2.png"
                                alt="Doctor 3"
                                className="w-32 h-32 mx-auto rounded-full mb-4"
                            />
                            <h3 className="font-semibold">Dr. Pedro Gómez</h3>
                            <p>Cirujano</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de Contacto */}
            <section id="contact" className="py-20 bg-gray-400 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-semibold">Contacto</h2>
                    <p className="mt-4 text-lg">
                        ¿Tienes alguna pregunta o necesitas más información? Contáctanos
                        hoy mismo.
                    </p>
                    <a 
                        href="mailto:molano.johny721@gmail.com?subject=Consulta&body=Hola, quiero más información..."
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 inline-block"
                    >
                        Envíanos un correo
                    </a>
                </div>
            </section>
        </MainLayout>
    );
};

export default Home;
