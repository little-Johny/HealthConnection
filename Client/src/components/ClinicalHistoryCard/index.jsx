import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "./../Button";

export default function ClinicalHistoryCard({ clinicalHistory, onSave, isEditable }) {
    const initialValues = {
        bloodType: clinicalHistory.bloodType || '',
        weight: clinicalHistory.weight || '',
        height: clinicalHistory.height || '',
        chronicDiseases: clinicalHistory.chronicDiseases || '',
        allergies: clinicalHistory.allergies || ''
    };

    const validationSchema = Yup.object({
        bloodType: Yup.string().required('Requerido'),
        weight: Yup.number().positive('Debe ser positivo').required('Requerido'),
        height: Yup.number().positive('Debe ser positivo').required('Requerido'),
        chronicDiseases: Yup.string(),
        allergies: Yup.string()
    });

    return (
        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl mx-auto mt-6">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onSave?.(values);
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting, dirty }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <div>
                            <label className="font-medium">Tipo de Sangre</label>
                            <Field
                                name="bloodType"
                                className="input input-bordered w-full"
                                disabled={!isEditable}
                            />
                            <ErrorMessage name="bloodType" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="font-medium">Peso (kg)</label>
                            <Field
                                name="weight"
                                type="number"
                                className="input input-bordered w-full"
                                disabled={!isEditable}
                            />
                            <ErrorMessage name="weight" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="font-medium">Altura (m)</label>
                            <Field
                                name="height"
                                type="number"
                                step="0.01"
                                className="input input-bordered w-full"
                                disabled={!isEditable}
                            />
                            <ErrorMessage name="height" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="font-medium">Alergias</label>
                            <Field
                                as="textarea"
                                name="allergies"
                                className="textarea textarea-bordered w-full"
                                disabled={!isEditable}
                            />
                            <ErrorMessage name="allergies" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="font-medium">Enfermedades Crónicas</label>
                            <Field
                                as="textarea"
                                name="chronicDiseases"
                                className="textarea textarea-bordered w-full"
                                disabled={!isEditable}
                            />
                            <ErrorMessage name="chronicDiseases" component="div" className="text-red-500 text-sm" />
                        </div>

                        {isEditable && dirty && (
                            <div className="md:col-span-2 flex justify-end mt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isSubmitting}
                                    className='p-4'
                                >
                                    Guardar Cambios
                                </Button>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>

            {/* Observaciones */}
            <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Observaciones</h3>
                {clinicalHistory.observations && clinicalHistory.observations.length > 0 ? (
                    <ul className="space-y-4">
                        {clinicalHistory.observations.map(obs => (
                            <li key={obs.id} className="border-l-4 border-indigo-600 pl-4">
                                <p><span className="font-semibold">Diagnóstico:</span> {obs.diagnosis}</p>
                                <p><span className="font-semibold">Tratamiento:</span> {obs.treatment}</p>
                                <p><span className="font-semibold">Notas:</span> {obs.notes}</p>
                                <p className="text-sm text-gray-500">
                                    Última actualización: {new Date(obs.updatedAt).toLocaleString('es-CO')}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No hay observaciones registradas.</p>
                )}
            </div>
        </div>
    );
}
