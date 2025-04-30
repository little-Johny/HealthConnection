import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IoChevronBackOutline } from 'react-icons/io5';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';  // Estilos de Toastify
import { useAuth } from './../../hooks/useAuth';
import { login as LoginRequest } from './../../api/auth';
import MainLayout from './../../components/Layout';
import Button from './../../components/Button';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Obtén la función login del contexto

    const validationSchema = Yup.object({
        username: Yup.string()
            .required('El usuario es obligatorio'),
        password: Yup.string()
            .required('La contraseña es obligatoria'),
    });

    const initialValues = {
        username: '',
        password: '',
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await LoginRequest(values)
            const token = response.data.data;
            console.log(token);
            login(token);//almacenamiento de token en el contexto
            toast.success('Bienvenido!');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error('Credenciales invalidas');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <MainLayout containerClass='flex items-center px-2' LayoutClass='bg-gray-400'>
            <Button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 bg-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition"
                aria-label="Volver"
            >
                <IoChevronBackOutline className="w-5 h-5" />
            </Button>
            <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                    <Form className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium">Usuario</label>
                            <Field name="username" type="text" className="w-full border rounded p-2 mt-1" />
                            <ErrorMessage name="username" component="div" className="text-red-500 text-sm font-semibold" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
                            <Field name="password" type="password" className="w-full border rounded p-2 mt-1" />
                            <ErrorMessage name="password" component="div" className="text-red-500 text-sm font-semibold" />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            variant="primary"
                            className="w-full"
                        >
                            {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
                        </Button>
                    </Form>
                    )}
                </Formik>
            </div>
        </MainLayout>
    );
};

export default Login;
