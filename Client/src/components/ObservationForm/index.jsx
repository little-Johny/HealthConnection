import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Button from './../Button';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile } from '../../api/user';

export default function ObservationForm({ onSubmit, observation }) {
    const { userId, rol } = useAuth();
    const [doctorId, setDoctorId] = useState(null);
    const [initialValues, setInitialValues] = useState({
        /* clinicalHistoryId: observation ? observation.clinicalHistoryId : 0,
        doctorId: observation ? observation.doctorId : 0, */
        diagnosis: observation ? observation.diagnosis : '',
        treatment: observation ? observation.treatment : '',
        notes: observation ? observation.notes : '',
    });

    useEffect(() => {
        if (!observation && rol === 'doctor') {
            const getDoctorIdFromToken = async () => {
                try {
                    const response = await getUserProfile(userId);
                    const fetchedDoctorId = response.data.data.doctor.id;
                    setDoctorId(fetchedDoctorId);
                    setInitialValues(prev => ({
                        ...prev,
                        doctorId: fetchedDoctorId,
                    }));
                } catch (error) {
                    toast.error('No se pudo obtener el doctor');
                }
            };

            getDoctorIdFromToken();
        }
    }, [observation, rol, userId]);

    const validationSchema = Yup.object({
        diagnosis: Yup.string().required('El diagnóstico es obligatorio'),
        treatment: Yup.string(),
        notes: Yup.string(),
    });

    if (!observation && rol === 'doctor' && doctorId === null) {
        return <p className="text-center text-gray-500">Cargando datos del doctor...</p>;
    }

    return (
        <div className="bg-white rounded-2xl p-6 max-w-3xl w-full mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                {observation ? 'Editar Observación' : 'Crear Observación'}
            </h2>

            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Diagnóstico:</label>
                            <Field
                                type="text"
                                name="diagnosis"
                                className="w-full border p-2 rounded"
                            />
                            <ErrorMessage name="diagnosis" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tratamiento:</label>
                            <Field
                                type="text"
                                name="treatment"
                                className="w-full border p-2 rounded"
                            />
                            <ErrorMessage name="treatment" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Notas:</label>
                            <Field
                                type="text"
                                name="notes"
                                className="w-full border p-2 rounded"
                            />
                            <ErrorMessage name="notes" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="md:col-span-2 text-right mt-4">
                            <Button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                disabled={isSubmitting}
                            >
                                {observation ? 'Actualizar Observación' : 'Crear Observación'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

