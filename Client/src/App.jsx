/* import { AuthProvider } from './context/AuthContext'; */ // Importa AuthProvider

import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
      <>
        <ToastContainer
          position="bottom-left"
          autoClose={4000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <AppRoutes />
      </>
  );
};

export default App;
