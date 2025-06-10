import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "./../Button";
import { toast } from "react-toastify";
import { deleteObservation, partiallyUpdateObsevation } from "../../api/observation";
import ObservationForm from "../ObservationForm";
import { useAuth } from "../../hooks/useAuth";

export default function ClinicalHistoryCard({ clinicalHistory, onSave, isEditable }) {
    const { rol, token } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [selectedObservation, setSelectedObservation] = useState(null);
    const isPatient = token && rol === 'patient'

    const initialValues = {
        bloodType: clinicalHistory.bloodType || '',
        weight: clinicalHistory.weight || '',
        height: clinicalHistory.height || '',
        chronicDiseases: clinicalHistory.chronicDiseases || '',
        allergies: clinicalHistory.allergies || ''
    };

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

    const handleDeleteObservation = async (id) => {
        try {
            await deleteObservation(id);
            toast.success('Observación eliminada exitosamente');
        } catch (error) {
            toast.error('No se pudo eliminar la observación');
            console.error('Error al eliminar observación:', error);
        }
    };

    const handleEditObservation = (observation) => {
        setSelectedObservation(observation);
        setShowModal(true);
    };

    const handleObservationSubmit = async (updatedData) => {
        try {
            const response = await partiallyUpdateObsevation(selectedObservation.id, updatedData);
            console.log(response);
            toast.success("Observación actualizada exitosamente");
            setShowModal(false);
            setSelectedObservation(null);
        } catch (error) {
            toast.error("No se pudo actualizar la observación");
            console.error("Error al actualizar observación:", error);
        }
    };

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
                                as="select"
                                name="bloodType"
                                className="input input-bordered w-full"
                                disabled={!isEditable}
                            >
                                <option value="">Seleccione</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </Field>
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
                            <label className="font-medium">Altura (cm)</label>
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
                                    className="p-4"
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
                    <ul className="space-y-6">
                        {clinicalHistory.observations.map((obs) => (
                            <li key={obs.id} className="border-l-4 border-indigo-600 pl-4 relative">
                                <div className="mb-2">
                                    <p><span className="font-semibold">Diagnóstico:</span> {obs.diagnosis || 'N/N'}</p>
                                    <p><span className="font-semibold">Tratamiento:</span> {obs.treatment || 'N/N'}</p>
                                    <p><span className="font-semibold">Notas:</span> {obs.notes || 'N/N'}</p>
                                    <p className="text-sm text-gray-500">
                                        Última actualización: {new Date(obs.updatedAt).toLocaleString('es-CO')}
                                    </p>
                                </div>
                                {!isPatient && (
                                    <div className="flex gap-2">
                                        <Button
                                            className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                            onClick={() => handleDeleteObservation(obs.id)}
                                        >
                                            Eliminar
                                        </Button>
                                        <Button
                                            className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                            onClick={() => handleEditObservation(obs)}
                                        >
                                            Editar
                                        </Button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No hay observaciones registradas.</p>
                )}
            </div>

            {showModal && selectedObservation && (
                <ObservationForm
                    observation={selectedObservation}
                    onSubmit={handleObservationSubmit}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedObservation(null);
                    }}
                />
            )}
        </div>
    );
}
