import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleSubmit = (route) => {
        route === 'login' ? navigate('/login') : navigate('/paciente-register'); 
    };

    return (
        <div className="bg-gray-100">
            {/* Barra de Navegación */}
            <nav className="bg-orange-600 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <a href="#" className="text-white text-xl">Health Connection</a>
                    <button
                        className="text-white block lg:hidden"
                        aria-label="Toggle Navigation"
                    >
                        <span className="navbar-toggler-icon">☰</span>
                    </button>
                    <div className="lg:flex space-x-6 hidden">
                        <a href="#about" className="text-white hover:text-indigo-300">Nosotros</a>
                        <a href="#services" className="text-white hover:text-indigo-300">Servicios</a>
                        <a href="#team" className="text-white hover:text-indigo-300">Equipo Médico</a>
                        <a href="#contact" className="text-white hover:text-indigo-300">Contacto</a>
                    </div>
                </div>
            </nav>

            {/* Encabezado */}
            <header className="bg-orange-500 text-center text-white py-20 ">
                <h1 className="text-4xl font-bold">Bienvenido a Health Connection</h1>
                <p className="text-xl mt-4">Tu salud, nuestra prioridad</p>
                <div className="flex justify-around px-96">
                    <button
                        onClick={() => handleSubmit('login')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 inline-block"
                    >
                        Ingresar
                    </button>
                    <button
                        onClick={() => handleSubmit('register')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 inline-block"
                    >
                        Registrate
                    </button>

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
            <section id="services" className="py-20 bg-gray-400">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl text-white mb-5">Nuestros Servicios</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h5 className="text-xl font-bold">Consulta Médica</h5>
                            <p className="mt-3">
                                Ofrecemos consultas médicas con especialistas en diversas
                                áreas, garantizando un diagnóstico preciso y un tratamiento
                                adecuado.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h5 className="text-xl font-bold">Exámenes de Laboratorio</h5>
                            <p className="mt-3">
                                Realiza tus exámenes de laboratorio con nosotros, contamos con
                                tecnología avanzada para obtener resultados confiables y
                                rápidos.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h5 className="text-xl font-bold">Afiliaciones</h5>
                            <p className="mt-3">
                                Nuestros planes de afiliación ajustables a cualquier tipo de
                                necesidad.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de Equipo Médico */}
            <section id="team" className="py-20 bg-white text-center">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-semibold mb-5">Nuestro Equipo Médico</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Miembro del equipo 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <img
                                src="../public/images/Doctor.png"
                                alt="Doctor 1"
                                className="w-32 h-32 mx-auto rounded-full mb-4"
                            />
                            <h3 className="font-semibold">Dr. Juan Pérez</h3>
                            <p>Cardiólogo</p>
                        </div>
                        {/* Miembro del equipo 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <img
                                src="../public/images/Doctor.png"
                                alt="Doctor 2"
                                className="w-32 h-32 mx-auto rounded-full mb-4"
                            />
                            <h3 className="font-semibold">Dra. María López</h3>
                            <p>Dermatóloga</p>
                        </div>
                        {/* Miembro del equipo 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <img
                                src="../public/images/Doctor.png"
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
                        href="mailto:info@healthconnection.com"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 inline-block"
                    >
                        Enviar un Correo
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-6">
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 Health Connection. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
