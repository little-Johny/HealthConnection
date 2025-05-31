import { useSearchParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { changePassword } from "../../api/auth";
import { toast } from "react-toastify";
import MainLayout from "../../components/Layout";
import Button from "../../components/Button";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const initialValues = {
        password: '',
        confirmPassword: ''
    };

    const validationSchema = Yup.object().shape({
        password: Yup.string().min(6, 'Debe tener al menos 6 caracteres').required('Requerido'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
            .required('Requerido')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await changePassword({ token, newPassword: values.password });
            toast.success('Contraseña actualizada correctamente');
            navigate('/login');
        } catch (error) {
            toast.error('Error al actualizar la contraseña');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <MainLayout containerClass="flex justify-center items-center min-h-screen px-4 py-6 bg-gray-100">
            <div className="p-8 w-full max-w-md bg-white shadow-lg rounded-xl border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Restablecer contraseña
                </h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-5">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nueva contraseña
                                </label>
                                <Field
                                    name="password"
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmar contraseña
                                </label>
                                <Field
                                    name="confirmPassword"
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
                            >
                                {isSubmitting ? 'Actualizando...' : 'Actualizar contraseña'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </MainLayout>
    );
}
