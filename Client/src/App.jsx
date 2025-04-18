import { AuthProvider } from './context/AuthContext'; // Importa AuthProvider

import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
