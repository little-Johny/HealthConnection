import { createContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar token al iniciar
    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('auth_token');
                if (storedToken) setToken(storedToken);
            } catch (error) {
                console.error('Error cargando token:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    // Guardar token al iniciar sesión
    const login = async (newToken) => {
        try {
            await AsyncStorage.setItem('auth_token', newToken);
            setToken(newToken);
        } catch (error) {
            console.error('Error guardando token:', error);
        }
    };

    // Eliminar token al cerrar sesión
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('auth_token');
            setToken(null);
        } catch (error) {
            console.error('Error eliminando token:', error);
        }
    };

    // Decodificar token si existe
    const decodedToken = useMemo(() => {
        if (!token) return null;
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('Error al decodificar token:', error);
            return null;
        }
    }, [token]);

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
