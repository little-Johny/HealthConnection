import { useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Importa AuthProvider

import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute'; // Ruta protegida
import Dashboard from'./pages/Dashboard';
import UserTable from './pages/Manage-users';
import PacienteRegister from './pages/PacienteRegister';
import ProfileAdmin from './pages/ProfileAdmin';
import ProfilePaciente from './pages/ProfilePaciente';
import DoctorRegister from './pages/DoctorRegister';
import AdministrativoRegister from './pages/AdminRegister';
import ProfileDoctor from './pages/ProfileDoctor';
import CreateCita from './pages/RegisterCita';
import { ToastContainer } from 'react-toastify';
import AgendaDoctor from './pages/AgendaDoctor';
import PacietneCitas from './pages/PacienteCitas';

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
      path: '/solicitar-cita/:userId',
      element: (
        <ProtectedRoute>
          {/* Solo accede al Dashboard si el usuario está autenticado */}
          <CreateCita /> {/* Asegúrate de tener el componente Dashboard */}
        </ProtectedRoute>
      ),
    },
    {
      path: '/agenda-doctor',
      element: (
        <ProtectedRoute>
          {/* Solo accede al Dashboard si el usuario está autenticado */}
          <AgendaDoctor /> {/* Asegúrate de tener el componente Dashboard */}
        </ProtectedRoute>
      ),
    },
    {
      path: '/mis-citas',
      element: (
        <ProtectedRoute>
          {/* Solo accede al Dashboard si el usuario está autenticado */}
          <PacietneCitas /> {/* Asegúrate de tener el componente Dashboard */}
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin-profile/:userId',
      element: (
        <ProtectedRoute>
          {/* Solo accede al Dashboard si el usuario está autenticado */}
          <ProfileAdmin/> {/* Asegúrate de tener el componente Dashboard */}
        </ProtectedRoute>
      ),
    },
    {
      path: '/doctor-profile/:userId',
      element: (
        <ProtectedRoute>
          {/* Solo accede al Dashboard si el usuario está autenticado */}
          <ProfileDoctor/> {/* Asegúrate de tener el componente Dashboard */}
        </ProtectedRoute>
      ),
    },
    {
      path: '/doctor-register',
      element: (
        <ProtectedRoute>
          {/* Solo accede al Dashboard si el usuario está autenticado */}
          <DoctorRegister/> {/* Asegúrate de tener el componente Dashboard */}
        </ProtectedRoute>
      ),
    },
    {
      path: '/administrativo-register',
      element: (
        <ProtectedRoute>
          {/* Solo accede al Dashboard si el usuario está autenticado */}
          <AdministrativoRegister/> {/* Asegúrate de tener el componente Dashboard */}
        </ProtectedRoute>
      ),
    },
    {
      path: '/paciente-profile/:userId',
      element: (
        <ProtectedRoute>
          {/* Solo accede al Dashboard si el usuario está autenticado */}
          <ProfilePaciente/> {/* Asegúrate de tener el componente Dashboard */}
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
      <ToastContainer />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
