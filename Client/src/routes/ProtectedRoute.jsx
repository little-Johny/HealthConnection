import { Navigate } from 'react-router-dom';
import { useAuth } from './../hooks/useAuth';



export default function ProtectedRoute({ children, redirectTo = '/login' }) {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to={redirectTo} replace/>
    };

    return children;
};
