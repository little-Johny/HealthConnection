import { useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Importa AuthProvider

import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute'; // Ruta protegida
import Dashboard from'./pages/Dashboard';
import UserTable from './pages/Manage-users';
import PacienteRegister from './pages/PacienteRegister';

// Componente que maneja las rutas
const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/paciente-register', element: <PacienteRegister /> },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          {/* Solo accede al Dashboard si el usuario está autenticado */}
          <Dashboard /> {/* Asegúrate de tener el componente Dashboard */}
        </ProtectedRoute>
      ),
    },
    {
      path: '/manage-users',
      element: (
        <ProtectedRoute>
          {/* Solo accede al UserTable si el usuario está autenticado */}
          <UserTable /> {/* Asegúrate de tener el componente UserTable */}
        </ProtectedRoute>
      ),
    },
  ]);

  return routes;
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
