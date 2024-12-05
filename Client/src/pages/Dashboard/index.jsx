
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-indigo-600 p-4 shadow-lg">
                <h1 className="text-white text-2xl font-bold text-center">Panel de Administración</h1>
            </header>

            <main className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Opción 1: Registrar Paciente */}
                    <Link to="/paciente-register" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-gray-50 transition">
                        <h2 className="text-indigo-600 text-xl font-bold mb-2">Registrar Paciente</h2>
                        <p className="text-gray-600">Añadir un nuevo paciente al sistema.</p>
                    </Link>

                    {/* Opción 2: Registrar Doctor */}
                    <Link to="/register-doctor" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-gray-50 transition">
                        <h2 className="text-indigo-600 text-xl font-bold mb-2">Registrar Doctor</h2>
                        <p className="text-gray-600">Registrar un nuevo doctor en el sistema.</p>
                    </Link>

                    {/* Opción 3: Registrar Personal Administrativo */}
                    <Link to="/register-staff" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-gray-50 transition">
                        <h2 className="text-indigo-600 text-xl font-bold mb-2">Registrar Personal Administrativo</h2>
                        <p className="text-gray-600">Añadir personal administrativo al sistema.</p>
                    </Link>

                    {/* Opción 4: Gestionar Usuarios */}
                    <Link to="/manage-users" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-gray-50 transition">
                        <h2 className="text-indigo-600 text-xl font-bold mb-2">Gestionar Usuarios</h2>
                        <p className="text-gray-600">Ver información de los usuarios.</p>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
