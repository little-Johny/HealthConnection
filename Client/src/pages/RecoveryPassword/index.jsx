import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IoChevronBackOutline } from "react-icons/io5";
import { recovery } from "../../api/auth";
import MainLayout from "../../components/Layout";
import Button from "../../components/Button";
import { toast } from "react-toastify";

export default function RecoveryPassword() {
    const navigate = useNavigate();

    const initialValue = {
        email: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Correo inválido')
            .required('El correo es obligatorio'),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await recovery(values); // envía { email }
            toast.success('Correo de recuperación enviado');
            resetForm();
        } catch (error) {
            toast.error('Hubo un error al enviar el correo');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <MainLayout containerClass='flex justify-center items-center px-4 py-6'>
            <Button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 bg-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition"
                aria-label="Volver"
            >
                <IoChevronBackOutline className="w-5 h-5" />
            </Button>

            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-semibold mb-4 text-center">Recuperar contraseña</h2>
                <p className="text-sm text-gray-600 mb-6 text-center">
                    Escribe tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>

                <Formik
                    initialValues={initialValue}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Correo electrónico
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-orange-400"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded transition"
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </MainLayout>
    );
}
