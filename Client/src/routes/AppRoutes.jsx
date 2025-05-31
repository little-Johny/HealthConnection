import { useRoutes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'; 
import Home from './../pages/Home';
import Login from './../pages/Login';
import Register from './../pages/Register';
import Dashboard from './../pages/Dashboard';
import UserTable from './../pages/Manage-users';
import Profile from './../pages/Profile';
import CreateClinicalHistory from './../pages/CreateClinicalHistory';
import ClinicalHistory from './../pages/ClinicalHistory';
import CreateAppointment from './../pages/CreateAppointment';
import AppointmentTable from './../pages/Manage-appointments';
import Appointment from './../pages/Appointment';
import CreateSchedule from '../pages/CreateSchedule';
import Schedule from '../pages/Schedule';
import CreateObservation from '../pages/CreateObservation';
import CreatePost from '../pages/CreatePost';
import PostTable from '../pages/Manage-post';
import RecoveryPassword from '../pages/RecoveryPassword';
import ResetPassword from '../pages/ResetPassword';


const AppRoutes = () => {
    const routes = useRoutes([
        { path: '/', element: <Home /> },
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register/> },
        { path: '/recovery-password', element: <RecoveryPassword/> },
        { path: '/reset-password', element: <ResetPassword/>},
        
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
        {
            path: '/create-clinical-history/:patientId',
            element: (
                <ProtectedRoute>
                    <CreateClinicalHistory/>
                </ProtectedRoute>
            ),
        },
        {
            path: '/clinical-history/:clinicalHistoryId',
            element: (
                <ProtectedRoute>
                    <ClinicalHistory/>
                </ProtectedRoute>
            ),
        },
        {
            path:'/create-appointment',
            element: (
                <ProtectedRoute>
                    <CreateAppointment/>
                </ProtectedRoute>
            )
        },
        {
            path: '/manage-appointment',
            element:(
                <ProtectedRoute>
                    <AppointmentTable/>
                </ProtectedRoute>
            )
        },
        {
            path: '/appointment/:appointmentId',
            element: (
                <ProtectedRoute>
                    <Appointment/>
                </ProtectedRoute>
            )
        },
        {
            path: '/create-schedule',
            element: (
                <ProtectedRoute>
                    <CreateSchedule/>
                </ProtectedRoute>
            )
        },
        {
            path: `/schedule`,
            element: (
                <ProtectedRoute>
                    <Schedule/>
                </ProtectedRoute>
            )
        },
        {
            path: `/schedule/:doctorId`,
            element: (
                <ProtectedRoute>
                    <Schedule/>
                </ProtectedRoute>
            )
        },
        {
            path: '/add-observation/:clinicalHistoryId',
            element: (
                <ProtectedRoute>
                    <CreateObservation/>
                </ProtectedRoute>
            )
        },
        {
            path: '/add-post',
            element: (
                <ProtectedRoute>
                    <CreatePost/>
                </ProtectedRoute>
            ),
        },
        {
            path: '/manage-post',
            element: (
                <ProtectedRoute>
                    <PostTable/>
                </ProtectedRoute>
            )
        }
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
