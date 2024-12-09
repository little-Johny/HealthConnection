import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [rol, setRol] = useState(null);
    const [userId, setUserId] = useState(null); // Agrega el estado para el ID
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('auth_token');
            const storedRol = localStorage.getItem('rol');
            const storedUserId = localStorage.getItem('userId'); // Lee el ID del localStorage

            if (storedToken && storedRol && storedUserId) {
                setToken(storedToken);
                setRol(storedRol);
                setUserId(storedUserId); // Asigna el ID
            }
        } catch (error) {
            console.error('Error accessing localStorage during initialization', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (newToken, newRol, newUserId) => {
        setToken(newToken);
        setRol(newRol);
        setUserId(newUserId); // Guarda el ID en el contexto
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('rol', newRol);
        localStorage.setItem('userId', newUserId); // Guarda el ID en localStorage
    };

    const logout = () => {
        setToken(null);
        setRol(null);
        setUserId(null); // Limpia el ID
        localStorage.removeItem('auth_token');
        localStorage.removeItem('rol');
        localStorage.removeItem('userId'); // Elimina el ID de localStorage
    };

    return (
        <AuthContext.Provider value={{ token, rol, userId, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};


AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
