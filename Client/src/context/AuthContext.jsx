import { createContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) setToken(storedToken);
        setIsLoading(false);
    }, []);

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('auth_token', newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('auth_token');
    };

    const decodedToken = useMemo(() => {
        if (!token) {
            console.log('No hay token para decodificar');
            return null;
        }

        console.log('Token recibido en el contexto:', token); 

        try {
            const decoded = jwtDecode(token); 
            console.log('Token decodificado:', decoded);
            return decoded;
        } catch (error) {
            console.error('Error al decodificar el token:', error.message);
            return null;
        }
    }, [token, isLoading]);

    const rol = decodedToken?.rol || decodedToken?.role;
    const userId = decodedToken?.sub;

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
