import { Stack } from 'expo-router';
import AuthProvider, { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import LoadingScreen from '../components/LoadingScreen';

function InnerLayout() {
    const { isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return <Stack />;
}

export default function Layout() {
    return (
        <AuthProvider>
            <InnerLayout />
        </AuthProvider>
    );
}