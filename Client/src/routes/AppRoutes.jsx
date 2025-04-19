import { useRoutes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'; 
import Home from './../pages/Home';
import Login from './../pages/Login';
import Register from './../pages/Register';
import Dashboard from './../pages/Dashboard';
import UserTable from './../pages/Manage-users';
import Profile from './../pages/Profile';


const AppRoutes = () => {
    const routes = useRoutes([
        { path: '/', element: <Home /> },
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register/> },
        
        // Rutas protegidas
        {
            path: '/dashboard',
            element: (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            ),
        },
        {
            path: '/manage-users',
            element: (
                <ProtectedRoute>
                    <UserTable />
                </ProtectedRoute>
            ),
        },
        {
            path: '/profile',
            element: (
                <ProtectedRoute>
                    <Profile/>
                </ProtectedRoute>
            ),
        },
        {
            path: '/profile/:userId',
            element: (
                <ProtectedRoute>
                    <Profile/>
                </ProtectedRoute>
            ),
        },
        /* ,
        {
        path: '/solicitar-cita/:userId',
        element: (
            <ProtectedRoute>
                <CreateCita />
            </ProtectedRoute>
        ),
        },
        {
        path: '/agenda-doctor',
        element: (
            <ProtectedRoute>
                <AgendaDoctor />
            </ProtectedRoute>
        ),
        },
        {
        path: '/mis-citas',
        element: (
            <ProtectedRoute>
                <PacienteCitas />
            </ProtectedRoute>
        ),
        },
        {
        path: '/admin-profile/:userId',
        element: (
            <ProtectedRoute>
                <ProfileAdmin />
            </ProtectedRoute>
        ),
        },
        {
        path: '/doctor-profile/:userId',
        element: (
            <ProtectedRoute>
                <ProfileDoctor />
            </ProtectedRoute>
        ),
        },
        {
        path: '/doctor-register',
        element: (
            <ProtectedRoute>
                <DoctorRegister />
            </ProtectedRoute>
        ),
        },
        {
        path: '/administrativo-register',
        element: (
            <ProtectedRoute>
                <AdministrativoRegister />
            </ProtectedRoute>
        ),
        },
        {
        path: '/paciente-profile/:userId',
        element: (
            <ProtectedRoute>
                <ProfilePaciente />
            </ProtectedRoute>
        ),
        },
         */
    ]);

    return routes;
};

export default AppRoutes;
