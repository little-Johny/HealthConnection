import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Indica si se está restaurando la autenticación

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedRole = localStorage.getItem('role');
            

            if (storedToken && storedRole ) {
                setToken(storedToken);
                setRole(storedRole);
            }
        } catch (error) {
            console.error('Error accessing localStorage during initialization', error);
        } finally {
            setIsLoading(false); // Autenticación inicializada
        }
    }, []);

    const login = (newToken, newRole) => {
        setToken(newToken);
        setRole(newRole); // Guarda el rol
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', newRole); // Persiste el rol en localStorage
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    
    };

    return (
        <AuthContext.Provider value={{ token, role,  login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
