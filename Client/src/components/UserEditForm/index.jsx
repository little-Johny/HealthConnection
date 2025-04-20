import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from "./../Button";
import { useState } from 'react';

export default function UserEditForm({ user, onSubmit }) {
    const [preview, setPreview] = useState(user.photo || null);
    const isDoctor = !!user.doctor;
    const isPatient = !!user.patient;

    const initialValues = {
        name: user.name || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        photo: null,
        ...(isPatient && {
            birthdate: user.patient.birthdate || '',
            address: user.patient.address || '',
            city: user.patient.city || '',
        }),
        ...(isDoctor && {
            licenseNumber: user.doctor.licenseNumber || '',
            consultationFee: user.doctor.consultationFee || '',
        }),
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Requerido'),
        lastName: Yup.string().required('Requerido'),
        phone: Yup.string().required('Requerido'),
        ...(isPatient && {
            birthdate: Yup.date().required('Requerido'),
            address: Yup.string().required('Requerido'),
            city: Yup.string().required('Requerido'),
        }),
        ...(isDoctor && {
            licenseNumber: Yup.string().required('Requerido'),
            consultationFee: Yup.number().required('Requerido'),
        }),
    });

    const InputGroup = ({ label, name, type = "text" }) => (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
                {label}
            </label>
            <Field
                id={name}
                name={name}
                type={type}
                className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 bg-gray-50"
            />
            <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl w-full mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Editar Perfil</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ setFieldValue }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="col-span-1 md:col-span-2">
                                <input
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.currentTarget.files[0];
                                        setFieldValue("photo", file);
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setPreview(reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="photo"
                                    className="w-full flex flex-col items-center justify-center border border-dashed p-4 rounded-xl cursor-pointer hover:border-blue-400 transition"
                                >
                                    <span className="text-gray-600 text-sm mb-2">Haz clic para seleccionar una foto</span>
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="preview"
                                            className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                                            Sin foto
                                        </div>
                                    )}
                                </label>
                            </div>

                            <InputGroup label="Nombre" name="name" />
                            <InputGroup label="Apellido" name="lastName" />
                            <InputGroup label="Teléfono" name="phone" />

                            {isPatient && (
                                <>
                                    <InputGroup label="Fecha de nacimiento" name="birthdate" type="date" />
                                    <InputGroup label="Dirección" name="address" />
                                    <InputGroup label="Ciudad" name="city" />
                                </>
                            )}

                            {isDoctor && (
                                <>
                                    <InputGroup label="Licencia médica" name="licenseNumber" />
                                    <InputGroup label="Tarifa de consulta" name="consultationFee" type="number" />
                                </>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow transition"
                            >
                                Guardar cambios
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
