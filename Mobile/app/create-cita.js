import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from './../hooks/useAuth';
import { getSpecialities } from './../api/speciality';
import { getUsers, getUserProfile } from './../api/user';
import { createAppointment } from './../api/appointment';
import { getAvailability } from './../api/schedule';
import { Formik } from 'formik';
import * as Yup from 'yup';

export default function CreateAppointment() {
    const { userId, rol } = useAuth();
    const [specialities, setSpecialities] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [availableTime, setAvailableTime] = useState([]);
    const [patientId, setPatientId] = useState(null);
    const [consultationFee, setConsultationFee] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        getPatientIdFromToken();
        getApiSpecialities();
    }, []);

    const getApiSpecialities = async () => {
        try {
            console.log('Cargando especialidades...');
            const response = await getSpecialities();
            if (response.data && response.data.data) {
                setSpecialities(response.data.data);
                console.log('Especialidades cargadas:', response.data.data);
            } else {
                Alert.alert('Error', 'No se encontraron especialidades');
            }
        } catch (error) {
            console.error('Error al cargar especialidades:', error);
            Alert.alert('Error', 'No se pudieron cargar las especialidades');
        }
    };
    
    const getPatientIdFromToken = async () => {
        try {
            console.log('Obteniendo perfil del usuario...');
            const response = await getUserProfile(userId);
            setPatientId(response.data.data.patient.id);
            console.log('ID del paciente:', response.data.data.patient.id);
        } catch (error) {
            console.error('Error al obtener paciente:', error);
            Alert.alert('Error', 'No se pudo obtener el paciente');
        }
    };

    const getDoctors = async (specialityId) => {
        const selected = specialities.find(s => s.id === parseInt(specialityId));
        if (!selected) {
            Alert.alert('Error', 'Especialidad no encontrada');
            return;
        }
        console.log('Cargando doctores para especialidad:', selected.name);
        try {
            const response = await getUsers({ role: 'doctor', speciality: selected.name });
            const doctorUsers = response.data.data.filter(user => user.doctor);
            setDoctors(doctorUsers);
            console.log('Doctores cargados:', doctorUsers);
        } catch (error) {
            console.error('Error al cargar doctores:', error);
            Alert.alert('Error', 'No se pudieron cargar los doctores');
        }
    };

    const getDoctorSchedule = async (doctorId, date) => {
        console.log(`Obteniendo disponibilidad del doctor ${doctorId} para la fecha ${date}...`);
        try {
            const response = await getAvailability(doctorId, { status: 'available', date });
            if (response.data.error) {
                Alert.alert('Error', `El doctor no tiene horario para el día ${date}`);
            } else if (response.data.data.length === 0) {
                Alert.alert('Error', 'El doctor no tiene horario para esta fecha, por favor selecciona otra');
            } else {
                setAvailableTime(response.data.data);
                console.log('Horarios disponibles:', response.data.data);
            }
        } catch (error) {
            console.error('Error al obtener disponibilidad del doctor:', error);
            Alert.alert('Error', 'Hubo un error al obtener la disponibilidad del doctor');
        }
    };

    const formatTime = (time) => time.length === 5 ? `${time}:00` : time;

    const calculateEndTime = (startTime) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const end = new Date();
        end.setHours(hours + 1, minutes, 0, 0);
        return end.toTimeString().slice(0, 8);
    };

    const handleSubmit = async (values) => {
        const formattedStartTime = formatTime(values.startTime);
        const endTime = calculateEndTime(formattedStartTime);
        const { specialityId, doctorId, date, startTime } = values;
        if (!specialityId || !doctorId || !date || !startTime) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        try {
            console.log('Iniciando creación de cita...');
            let finalPatientId = patientId;

            const appointmentPayload = {
                ...values,
                patientId: finalPatientId,
                endTime,
                startTime: formattedStartTime,
            };

            await createAppointment(appointmentPayload);
            Alert.alert('Éxito', 'Cita creada con éxito');
        } catch (error) {
            console.error('Error al crear cita:', error);
            Alert.alert('Error', 'Hubo un error al crear la cita');
        }
    };

    // Handle changes without Formik handleChange for select inputs
    const handleSpecialityChange = (specialityId, setFieldValue) => {
        setFieldValue('specialityId', specialityId);
        getDoctors(specialityId);
    };

    const handleDateChange = async (event, selectedDateValue, setFieldValue, values) => {
        const currentDate = selectedDateValue || selectedDate;
        setShowDatePicker(false);
        setSelectedDate(currentDate);
    
        const formattedDate = currentDate.toISOString().split('T')[0];
        setFieldValue('date', formattedDate);
    
        if (values.doctorId && values.doctorId !== 0) {
            console.log('Ya hay un doctor seleccionado, obteniendo disponibilidad...');
            await getDoctorSchedule(values.doctorId, formattedDate);
        }
    };
    
    const handleDoctorChange = async (doctorId, setFieldValue, values) => {
        console.log('Doctor seleccionado:', doctorId); // ← Asegúrate de que esto se imprime
        setFieldValue('doctorId', doctorId);
        
        if (values.date) {
            console.log('Ya hay una fecha seleccionada:', values.date); // ← Confirmar que esto exista
            await getDoctorSchedule(doctorId, values.date);
        } else {
            console.log('No hay fecha aún, se limpia disponibilidad');
            setAvailableTime([]);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear cita médica</Text>

            <Formik
                initialValues={{
                    specialityId: 0,
                    doctorId: 0,
                    date: '',
                    startTime: '',
                    endTime: ''
                }}
                validationSchema={Yup.object({
                    specialityId: Yup.number().required('La especialidad es obligatoria'),
                    doctorId: Yup.number().required('El doctor es obligatorio'),
                    date: Yup.date().required('La fecha es obligatoria'),
                    startTime: Yup.string().required('La hora de inicio es obligatoria'),
                })}
                onSubmit={handleSubmit}
            >
                {({ handleBlur, handleSubmit, setFieldValue, values, errors, touched, handleChange }) => (
                    <>
                        <View style={styles.formGroup}>
                            <Text>Especialidad</Text>
                            <Picker
                                selectedValue={values.specialityId}
                                onValueChange={(itemValue) => handleSpecialityChange(itemValue, setFieldValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Seleccionar especialidad" value={0} />
                                {specialities.map(s => (
                                    <Picker.Item key={s.id} label={s.name} value={s.id} />
                                ))}
                            </Picker>
                            {touched.specialityId && errors.specialityId && (
                                <Text style={styles.error}>{errors.specialityId}</Text>
                            )}
                        </View>

                        <View style={styles.formGroup}>
                            <Text>Doctor</Text>
                            <Picker
                                selectedValue={values.doctorId}
                                onValueChange={(itemValue) => handleDoctorChange(itemValue, setFieldValue, values)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Seleccionar doctor" value={0} />
                                {doctors.map((doctor) => {
                                    const doctorId = doctor?.doctor?.id;
                                    const doctorName = `${doctor?.name ?? 'Sin nombre'} ${doctor?.lastName ?? ''}`;
                                    return <Picker.Item key={doctorId} label={doctorName} value={doctorId} />;
                                })}
                            </Picker>
                            {touched.doctorId && errors.doctorId && (
                                <Text style={styles.error}>{errors.doctorId}</Text>
                            )}
                        </View>

                        <View style={styles.formGroup}>
                            <Text>Fecha</Text>
                            <Button title="Seleccionar fecha" onPress={() => setShowDatePicker(true)} />
                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, date) => handleDateChange(event, date, setFieldValue, values)}
                                />
                            )}
                            <Text>{selectedDate.toLocaleDateString()}</Text>
                            {touched.date && errors.date && (
                                <Text style={styles.error}>{errors.date}</Text>
                            )}
                        </View>

                        <View style={styles.formGroup}>
                            <Text>Hora de inicio</Text>
                            <Picker
                                selectedValue={values.startTime}
                                onValueChange={handleChange('startTime')}
                                style={styles.picker}
                            >
                                <Picker.Item label="Seleccionar hora" value="" />
                                {availableTime && availableTime.length > 0 ? (
                                    availableTime.map(time => (
                                        <Picker.Item key={time} label={time} value={time} />
                                    ))
                                ) : (
                                    <Picker.Item label="No hay horarios disponibles" value="" />
                                )}
                            </Picker>
                            {touched.startTime && errors.startTime && (
                                <Text style={styles.error}>{errors.startTime}</Text>
                            )}
                        </View>

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Crear cita</Text>
                        </TouchableOpacity>
                    </>
                )}
            </Formik>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    formGroup: {
        width: '100%',
        marginBottom: 15,
    },
    picker: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
