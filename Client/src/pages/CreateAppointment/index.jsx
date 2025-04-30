import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { IoChevronBackOutline } from 'react-icons/io5';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from './../../hooks/useAuth';
import { getSpecialities } from './../../api/speciality';
import { getUsers, getUserProfile } from './../../api/user';
import { createAppointment } from './../../api/appointment';
import { getAvailability } from './../../api/schedule';
import Button from './../../components/Button';
import MainLayout from './../../components/Layout';
import { useNavigate } from 'react-router-dom';

export default function CreateAppointment() {
    const navigate = useNavigate();
    const { userId, rol } = useAuth();
    const isAdmin = rol === 'admin';
    const [specialities, setSpecialities] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [availableTime, setAvailableTime] = useState([]);
    const [patientId, setPatientId] = useState(null);
    const [document, setDocument] = useState('');
    const [consultationFee, setConsultationFee] = useState(null);

    useEffect(() => {
        getApiSpecialities();
        if (!isAdmin) {
            getPatientIdFromToken();
        }
    }, []);

    const getApiSpecialities = async () => {
        try {
            const response = await getSpecialities();
            setSpecialities(response.data.data);
        } catch (error) {
            toast.error('No se pudieron cargar las especialidades');
        }
    };

    const getPatientIdFromToken = async () => {
        try {
            const response = await getUserProfile(userId);
            setPatientId(response.data.data.patient.id);
        } catch (error) {
            toast.error('No se pudo obtener el paciente');
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

    const getdoctorSchedule = async (doctorId, date) => {
        try {
            const response = await getAvailability(doctorId, {
                status: 'available',
                date
            });

            if (response.data.error) {
                toast.error(`El doctor no tiene horario para el día ${date}`);
            } else if (response.data.data.length === 0) {
                toast.error('El doctor no tiene horario para esta fecha, por favor selecciona otra');
            } else {
                setAvailableTime(response.data.data);
            }
        } catch (error) {
            console.error('Error al obtener disponibilidad del doctor:', error);
            toast.error('Hubo un error al obtener la disponibilidad del doctor. Inténtalo nuevamente.');
        }
    };

    const formatTime = (time) => time.length === 5 ? `${time}:00` : time;

    const calculateEndTime = (startTime) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const end = new Date();
        end.setHours(hours + 1, minutes, 0, 0);
        return end.toTimeString().slice(0, 8);
    };

    const validationSchema = Yup.object({
        specialityId: Yup.number().required('La especialidad es obligatoria'),
        doctorId: Yup.number().required('El doctor es obligatorio'),
        date: Yup.date().required('La fecha es obligatoria'),
        startTime: Yup.string().required('La hora de inicio es obligatoria'),
    });

    const initialValues = {
        doctorId: 0,
        specialityId: 0,
        date: '',
        startTime: '',
        endTime: '',
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const formattedStartTime = formatTime(values.startTime);
            const endTime = calculateEndTime(formattedStartTime);
            let finalPatientId = patientId;
    
            if (isAdmin) {
                if (!document) {
                    toast.error('Debe ingresar el número de documento del paciente');
                    setSubmitting(false);
                    return;
                }
                const response = await getUsers({ role: 'patient', numberDocument: document });
                const patient = response.data.data[0];
                if (!patient) {
                    toast.error('No se encontró un paciente con ese documento');
                    setSubmitting(false);
                    return;
                }
                finalPatientId = patient.patient.id;
            }
    
            await createAppointment({
                ...values,
                startTime: formattedStartTime,
                endTime,
                patientId: finalPatientId
            });
    
            toast.success('Cita creada con éxito');
            navigate('/dashboard');
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error('Ya existe una cita para ese doctor a esa hora. Por favor elige otra.');
            } else {
                toast.error('Hubo un error al crear la cita');
            }
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
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Crear cita médica</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, isSubmitting }) => {
                        // Actualiza el precio cuando cambia el doctor
                        useEffect(() => {
                            const selectedDoctor = doctors.find(d => d.doctor.id === parseInt(values.doctorId));
                            if (selectedDoctor) {
                                setConsultationFee(selectedDoctor.doctor.consultationFee);
                            } else {
                                setConsultationFee(null);
                            }
                        }, [values.doctorId, doctors]);

                        return (
                            <Form className="space-y-5">
                                {isAdmin && (
                                    <div>
                                        <label className="block mb-1 text-gray-700 font-medium">Documento del paciente</label>
                                        <input
                                            type="text"
                                            value={document}
                                            onChange={(e) => setDocument(e.target.value)}
                                            placeholder="Número de documento"
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                {/* Select de especialidades */}
                                <div>
                                    <label className="block mb-1 text-gray-700 font-medium">Especialidad</label>
                                    <Field
                                        as="select"
                                        name="specialityId"
                                        onChange={e => {
                                            const specialityId = e.target.value;
                                            setFieldValue('specialityId', specialityId);
                                            getDoctors(specialityId);
                                        }}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccionar especialidad</option>
                                        {specialities.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="specialityId" component="div" className="text-red-500 text-sm" />
                                </div>

                                {/* Select de doctores */}
                                <div>
                                    <label className="block mb-1 text-gray-700 font-medium">Doctor</label>
                                    <Field
                                        as="select"
                                        name="doctorId"
                                        onChange={e => {
                                            const doctorId = e.target.value;
                                            setFieldValue('doctorId', doctorId);
                                            if (values.date) getdoctorSchedule(doctorId, values.date);
                                        }}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccionar doctor</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor.doctor.id} value={doctor.doctor.id}>
                                                {doctor.name} {doctor.lastName}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="doctorId" component="div" className="text-red-500 text-sm" />
                                </div>

                                {/* Precio de consulta */}
                                {consultationFee && (
                                    <div>
                                        <label className="block mb-1 text-gray-700 font-medium">Precio de la consulta</label>
                                        <input
                                            type="text"
                                            value={`$${consultationFee}`}
                                            readOnly
                                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                                        />
                                    </div>
                                )}

                                {/* Fecha */}
                                <div>
                                    <label className="block mb-1 text-gray-700 font-medium">Fecha</label>
                                    <Field
                                        type="date"
                                        name="date"
                                        onChange={e => {
                                            const date = e.target.value;
                                            setFieldValue('date', date);
                                            if (values.doctorId) getdoctorSchedule(values.doctorId, date);
                                        }}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />
                                </div>

                                {/* Hora de inicio */}
                                <div>
                                    <label className="block mb-1 text-gray-700 font-medium">Hora de inicio</label>
                                    <Field
                                        as="select"
                                        name="startTime"
                                        onChange={e => setFieldValue('startTime', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccionar hora</option>
                                        {availableTime.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm" />
                                </div>

                                {/* Hora de fin */}
                                <div>
                                    <label className="block mb-1 text-gray-700 font-medium">Hora de fin</label>
                                    <Field
                                        type="text"
                                        name="endTime"
                                        value={values.startTime ? calculateEndTime(formatTime(values.startTime)) : ''}
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                                    />
                                    <ErrorMessage name="endTime" component="div" className="text-red-500 text-sm" />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    {isSubmitting ? 'Creando...' : 'Crear cita'}
                                </Button>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </MainLayout>
    );
}

