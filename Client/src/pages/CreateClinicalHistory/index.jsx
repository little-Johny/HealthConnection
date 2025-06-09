import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { createClinicalHistory } from './../../api/clinicalHistory';
import { toast } from 'react-toastify';
import MainLayout from '../../components/Layout';
import { useEffect } from 'react';
import Button from '../../components/Button';
import { IoChevronBackOutline } from 'react-icons/io5';

export default function CreateClinicalHistory() {
    const { patientId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!patientId) {
            toast.error('No se encontró el paciente.');
            navigate('/dashboard');
        }
    }, [patientId, navigate]);

    const validationSchema = Yup.object({
        bloodType: Yup.string().required('Requerido'),
        weight: Yup.number()
            .positive('Debe ser positivo')
            .min(30, 'El peso mínimo es 20 kg')       // límite mínimo
            .max(300, 'El peso máximo es 300 kg')     // límite máximo
            .required('Requerido'),

        height: Yup.number()
            .positive('Debe ser positivo')
            .min(100, 'La altura mínima es 100 cm')   // límite mínimo
            .max(300, 'La altura máxima es 300 cm')   // límite máximo
            .required('Requerido'),
        chronicDiseases: Yup.string().required('Requerido'),
        allergies: Yup.string().required('Requerido'),
    });

    const initialValues = {
        patientId: Number(patientId), // lo convertimos a número
        bloodType: '',
        weight: '',
        height: '',
        chronicDiseases: 'n/n',
        allergies: 'n/n',
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
        await createClinicalHistory(values);
        toast.success('Historial clínico creado con éxito');
        navigate('/dashboard'); // o a donde prefieras redirigir después
        } catch (error) {
        console.error(error);
        toast.error('Error al crear el historial clínico');
        } finally {
        setSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <Button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 bg-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition"
                aria-label="Volver"
            >
                <IoChevronBackOutline className="w-5 h-5" />
            </Button>
            <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-6">Crear historial clínico</h1>
                <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
                >
                {({ isSubmitting }) => (
                    <Form className="space-y-4">
                    {/* Tipo de sangre */}
                    <div>
                        <label htmlFor="bloodType" className="block font-medium">Tipo de sangre</label>
                        <Field as="select" name="bloodType" className="w-full border border-gray-300 p-2 rounded">
                            <option value="">Selecciona un tipo</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </Field>
                        <ErrorMessage name="bloodType" component="div" className="text-sm text-red-500" />
                    </div>

                    {/* Peso */}
                    <div>
                        <label htmlFor="weight" className="block font-medium">Peso (kg)</label>
                        <Field type="number" name="weight" className="w-full border border-gray-300 p-2 rounded" />
                        <ErrorMessage name="weight" component="div" className="text-sm text-red-500" />
                    </div>

                    {/* Altura */}
                    <div>
                        <label htmlFor="height" className="block font-medium">Altura (cm)</label>
                        <Field type="number" name="height" className="w-full border border-gray-300 p-2 rounded" />
                        <ErrorMessage name="height" component="div" className="text-sm text-red-500" />
                    </div>

                    {/* Enfermedades crónicas */}
                    <div>
                        <label htmlFor="chronicDiseases" className="block font-medium">Enfermedades crónicas</label>
                        <Field as="textarea" name="chronicDiseases" className="w-full border border-gray-300 p-2 rounded" />
                        <ErrorMessage name="chronicDiseases" component="div" className="text-sm text-red-500" />
                    </div>

                    {/* Alergias */}
                    <div>
                        <label htmlFor="allergies" className="block font-medium">Alergias</label>
                        <Field as="textarea" name="allergies" className="w-full border border-gray-300 p-2 rounded" />
                        <ErrorMessage name="allergies" component="div" className="text-sm text-red-500" />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant='success'
                        className='p-4'
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </Button>
                    </Form>
                )}
                </Formik>
            </div>
        </MainLayout>
    );
}
