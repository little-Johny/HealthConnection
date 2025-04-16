import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';  // Importar ToastContainer
import { IoChevronBackOutline } from 'react-icons/io5'
import 'react-toastify/dist/ReactToastify.css';  // Estilos de Toastify
import { useAuth } from './../../hooks/useAuth';
import { login as LoginRequest } from './../../api/auth';
import MainLayout from '../../components/Layout';

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
            const token = response.data;
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
        <MainLayout containerClass=' flex items-center justify-center px-4'>
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 bg-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition"
                aria-label="Volver"
            >
                <IoChevronBackOutline className="w-5 h-5" />
            </button>
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

                        <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                        {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
                        </button>
                    </Form>
                    )}
                </Formik>
            </div>
        </MainLayout>
    );
};

export default Login;
