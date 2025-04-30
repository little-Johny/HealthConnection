import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Button from "./../Button";
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile, getUsers } from '../../api/user';

export default function ScheduleForm({ onSubmit, schedule }) {
    const { userId, rol } = useAuth();
    const [doctorId, setDoctorId] = useState(null);
    const [document, setDocument] = useState(''); // Añadimos estado para el documento

    // Obtener doctorId si el usuario es un doctor
    const getDoctorIdFromToken = async () => {
        try {
            const response = await getUserProfile(userId);
            setDoctorId(response.data.data.doctor.id);
        } catch (error) {
            toast.error(`No se pudo obtener el doctor`);
        }
    };

    // Obtener doctorId si el usuario es admin y usa el documento
    const getDoctorByDocument = async (document) => {
        try {
            const response = await getUsers({ role: 'doctor', numberDocument: document });
            const doctorId = response.data.data[0].doctor.id;
            setDoctorId(doctorId);
        } catch (error) {
            toast.error('No se encontró un doctor con ese documento');
        }
    };

    useEffect(() => {
        if (rol === 'doctor') {
            getDoctorIdFromToken();
        }
    }, [rol, userId]);

    // Lista de días de la semana
    const daysOfWeek = [
        { label: 'Lunes', value: 'Monday' },
        { label: 'Martes', value: 'Tuesday' },
        { label: 'Miercoles', value: 'Wednesday' },
        { label: 'Jueves', value: 'Thursday' },
        { label: 'Viernes', value: 'Friday' },
        { label: 'Sabado', value: 'Saturday' },
        { label: 'Domingo', value: 'Sunday' },
    ];

    // Establecemos los valores iniciales del formulario
    const initialValues = {
        doctorId: schedule ? schedule.doctorId : doctorId || '', // Si estamos editando, usamos el doctorId de schedule o el del token
        dayOfWeek: schedule ? schedule.dayOfWeek : '',
        startTime: schedule ? schedule.startTime : '',
        endTime: schedule ? schedule.endTime : '',
    };

    // Validación del formulario
    const validationSchema = Yup.object({
        dayOfWeek: Yup.string().required('El día de la semana es obligatorio'),
        startTime: Yup.string().required('La hora de inicio es obligatoria'),
        endTime: Yup.string().required('La hora de finalización es obligatoria'),
    });

    return (
        <div className="bg-white rounded-2xl  p-6 max-w-3xl w-full mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                {schedule ? 'Editar Horario' : 'Crear Horario'}
            </h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    const formatTimeWithSeconds = (time) => {
                        return time.length === 5 ? `${time}:00` : time; // si viene "08:00", convierte a "08:00:00"
                    };
                
                    const finalValues = {
                        doctorId: Number(doctorId),
                        dayOfWeek: values.dayOfWeek,
                        startTime: formatTimeWithSeconds(values.startTime),
                        endTime: formatTimeWithSeconds(values.endTime),
                    };
                
                    console.log('📤 Enviando valores al backend:', finalValues);
                    onSubmit(finalValues);
                }}
                
            >
                {({ setFieldValue }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rol === 'admin' && (
                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">Documento del Doctor</label>
                                <input
                                    type="text"
                                    value={document}
                                    onChange={(e) => setDocument(e.target.value)}
                                    placeholder="Número de documento"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onBlur={() => getDoctorByDocument(document)} // Llama a la API para obtener el doctor cuando pierda el foco
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">Día de la Semana</label>
                            <Field
                                as="select"
                                name="dayOfWeek"
                                className="w-full border p-2 rounded"
                            >
                                <option value="">Seleccione un día</option>
                                {daysOfWeek.map((day) => (
                                    <option key={day.value} value={day.value}>
                                        {day.label}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="dayOfWeek" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Hora de Inicio</label>
                            <Field
                                type="time"
                                name="startTime"
                                className="w-full border p-2 rounded"
                            />
                            <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Hora de Finalización</label>
                            <Field
                                type="time"
                                name="endTime"
                                className="w-full border p-2 rounded"
                            />
                            <ErrorMessage name="endTime" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="md:col-span-2 text-right mt-4">
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
                                {schedule ? 'Actualizar Horario' : 'Crear Horario'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
