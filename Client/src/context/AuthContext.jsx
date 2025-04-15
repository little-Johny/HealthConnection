import { createContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as jwt_decode from 'jwt-decode';


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
        if (!token) return null;
        try {
            return jwt_decode(token);
        } catch {
            return null;
        }
    }, [token] );

    const rol = decodedToken?.rol;
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
