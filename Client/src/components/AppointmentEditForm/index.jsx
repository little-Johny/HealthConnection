import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from "./../Button";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { getSpecialities } from '../../api/speciality';
import { getUsers } from '../../api/user';
import { getAvailability } from '../../api/schedule';

export default function AppointmentEditForm({ appointment, onSubmit }) {
    const [specialities, setSpecialities] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [availableTime, setAvailableTime] = useState([]);
    const [consultationFee, setConsultationFee] = useState(appointment.price || null);

    useEffect(() => {
        const init = async () => {
            await getApiSpecialities();

            if (appointment.specialityId) await getDoctors(appointment.specialityId);
            if (appointment.doctorId && appointment.date) await getDoctorSchedule(appointment.doctorId, appointment.date);
        };

        init();
    }, []);

    useEffect(() => {
        if (specialities.length > 0 && appointment.specialityId) {
            getDoctors(appointment.specialityId);
        }
    }, [specialities, appointment.specialityId]);

    const getApiSpecialities = async () => {
        try {
            const response = await getSpecialities();
            setSpecialities(response.data.data);
        } catch (error) {
            toast.error('No se pudieron cargar las especialidades');
        }
    };

    const getDoctors = async (specialityId) => {
        try {
            const selected = specialities.find(s => s.id === parseInt(specialityId));
            if (!selected) return;

            const response = await getUsers({ role: 'doctor', speciality: selected.name });
            const doctorUsers = response.data.data.filter(user => user.doctor);
            setDoctors(doctorUsers);
        } catch (error) {
            toast.error('No se pudieron cargar los doctores');
        }
    };

    const getDoctorSchedule = async (doctorId, date) => {
        try {
            const response = await getAvailability(doctorId, {
                status: 'available',
                date
            });

            if (response.data.error || response.data.data.length === 0) {
                toast.error('El doctor no tiene horario disponible para esta fecha');
                setAvailableTime([]);
            } else {
                setAvailableTime(response.data.data);
            }
        } catch (error) {
            toast.error('Hubo un error al obtener la disponibilidad del doctor');
        }
    };

    const formatToHHMMSS = (time) => {
        if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
        if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
        const [h, m] = time.split(':');
        return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`;
    };

    const calculateEndTime = (startTime) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const end = new Date();
        end.setHours(hours + 1, minutes, 0, 0);
        return end.toTimeString().slice(0, 8); // HH:mm:ss
    };

    const initialValues = {
        specialityId: appointment.specialityId || '',
        doctorId: appointment.doctorId || '',
        date: appointment.date || '',
        startTime: formatToHHMMSS(appointment.startTime || ''),
        endTime: formatToHHMMSS(appointment.endTime || ''),
        status: appointment.status || 'pending',
    };

    const validationSchema = Yup.object({
        specialityId: Yup.number().required('La especialidad es obligatoria'),
        doctorId: Yup.number().required('El doctor es obligatorio'),
        date: Yup.date().required('La fecha es obligatoria'),
        startTime: Yup.string().required('La hora de inicio es obligatoria'),
        status: Yup.string()
            .oneOf(['pending', 'confirmed', 'canceled', 'completed'], 'Estado inválido')
            .required('El estado es obligatorio'),
    });

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl w-full mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Editar Cita</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={(values) => {
                    const formattedStart = formatToHHMMSS(values.startTime);
                    const formattedEnd = formatToHHMMSS(calculateEndTime(values.startTime));

                    const updatedData = {
                        ...values,
                        startTime: formattedStart,
                        endTime: formattedEnd,
                        price: consultationFee
                    };
                    onSubmit(updatedData);
                }}
            >
                {({ values, handleChange, setFieldValue }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Especialidad</label>
                            <Field
                                as="select"
                                name="specialityId"
                                className="w-full border p-2 rounded"
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    setFieldValue("specialityId", selectedId);
                                    setFieldValue("doctorId", "");
                                    setDoctors([]);
                                    handleChange(e);
                                    getDoctors(selectedId);
                                }}
                            >
                                <option value="">Seleccione una especialidad</option>
                                {specialities.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="specialityId" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Doctor</label>
                            <Field
                                as="select"
                                name="doctorId"
                                className="w-full border p-2 rounded"
                                onChange={(e) => {
                                    const doctorId = e.target.value;
                                    setFieldValue("doctorId", doctorId);
                                    handleChange(e);
                                    if (values.date) getDoctorSchedule(doctorId, values.date);
                                }}
                            >
                                <option value="">Seleccione un doctor</option>
                                {doctors.map((doc) => (
                                    <option key={doc.doctor.id} value={doc.doctor.id}>
                                        {doc.name} {doc.lastName}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="doctorId" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Fecha</label>
                            <Field
                                type="date"
                                name="date"
                                className="w-full border p-2 rounded"
                                onChange={(e) => {
                                    setFieldValue("date", e.target.value);
                                    if (values.doctorId) getDoctorSchedule(values.doctorId, e.target.value);
                                }}
                            />
                            <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Hora de inicio</label>
                            <Field
                                as="select"
                                name="startTime"
                                className="w-full border p-2 rounded"
                                onChange={(e) => {
                                    const formattedTime = formatToHHMMSS(e.target.value);
                                    setFieldValue("startTime", formattedTime);
                                    setFieldValue("endTime", calculateEndTime(formattedTime));
                                }}
                            >
                                <option value="">Seleccione una hora</option>
                                {availableTime.map(time => (
                                    <option key={time} value={formatToHHMMSS(time)}>
                                        {formatToHHMMSS(time)}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Hora de finalización</label>
                            <Field
                                type="text"
                                name="endTime"
                                disabled
                                className="w-full border p-2 rounded bg-gray-100 text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Estado de la cita</label>
                            <Field
                                as="select"
                                name="status"
                                className="w-full border p-2 rounded"
                            >
                                <option value="pending">Pendiente</option>
                                <option value="confirmed">Confirmada</option>
                                <option value="cancelled">Cancelada</option>
                            </Field>
                            <ErrorMessage name="status" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="md:col-span-2 text-right mt-4">
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
                                Guardar cambios
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
