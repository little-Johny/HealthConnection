import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types'; // Importamos PropTypes

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Valida que `children` sea un nodo React (texto, elemento, fragmento, etc.)
};


export default ProtectedRoute;
