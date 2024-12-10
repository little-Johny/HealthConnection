import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';  // Importar ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Estilos de Toastify

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Obtén la función login del contexto
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Validar que los campos no estén vacíos
        if (!username || !password) {
            toast.error('Por favor, complete todos los campos.');
            return; // Evita continuar si los campos están vacíos
        }

        try {
            const response = await axios.post('http://localhost:3000/health_connection/v1/user/login', {
                username,
                password,
            });
    
            const { token, user } = response.data.data;
            const { rol, id } = user; // Extrae el ID
    
            // Almacena el token, rol e id en el contexto
            localStorage.setItem('auth_token', token);
            localStorage.setItem('rol', rol);
            localStorage.setItem('userId', id); // Guarda el ID en localStorage
    
            // Llama a la función login del contexto
            login(token, rol, id);
    
            // Redirige según el rol
            rol === 'administrador' || rol === 'asistente'
                ? navigate('/dashboard')
                : navigate('/');
        }  catch (error) {
            if (error.response) {
                // Si el error viene del servidor, mostramos el mensaje con toast
                toast.error(error.response.data.message); 
            } else if (error.request) {
                toast.error("Error en la solicitud, por favor intente más tarde.");
            } else {
                toast.error("Hubo un problema con la solicitud.");
            }
        }
    };
    
    


    return (
        <div className="flex justify-center items-center h-screen bg-orange-500">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md shadow-slate-800">
            <h2 className="text-3xl font-bold text-center text-orange-400 mb-6">Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ingresa tu nombre de usuario"
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>
        <ToastContainer /> 
    </div>
    );
};

export default Login;
