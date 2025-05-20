import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { getSpecialityById } from '../api/speciality';

export default function AppointmentCard({ appointment }) {
    const [specialityName, setSpecialityName] = useState('');

    const getApiSpecialities = async () => {
        try {
            const response = await getSpecialityById(appointment.specialityId);
            setSpecialityName(response.data.data.name);
        } catch (error) {
            Alert.alert('No se pudieron cargar las especialidades');
        }
    };

    useEffect(() => {
        getApiSpecialities();
    }, []);

    const STATUS_OPTIONS = {
        pending: { label: 'Pendiente', style: styles.pending },
        confirmed: { label: 'Confirmada', style: styles.confirmed },
        completed: { label: 'Completada', style: styles.completed },
        canceled: { label: 'Cancelada', style: styles.canceled },
    };

    const status = STATUS_OPTIONS[appointment.status];

    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Paciente: {appointment.patient.user.name} {appointment.patient.user.lastName}
            </Text>
            <Text style={styles.subtext}>
                Doctor: {appointment.doctor.user.name} {appointment.doctor.user.lastName}
            </Text>

            <View style={styles.infoGroup}>
                <Text style={styles.label}>Especialidad</Text>
                <Text>{specialityName}</Text>

                <Text style={styles.label}>Doctor</Text>
                <Text>{appointment.doctor.user.name} {appointment.doctor.user.lastName}</Text>

                <Text style={styles.label}>Fecha</Text>
                <Text>{appointment.date}</Text>

                <Text style={styles.label}>Hora</Text>
                <Text>{appointment.startTime} - {appointment.endTime}</Text>

                <Text style={styles.label}>Precio</Text>
                <Text>${appointment.price}</Text>

                <Text style={styles.label}>Estado</Text>
                <View style={[styles.statusBadge, status?.style]}>
                <Text style={styles.statusText}>{status?.label}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    subtext: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    infoGroup: {
        gap: 8,
    },
    label: {
        fontWeight: '600',
        marginTop: 8,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginTop: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    pending: {
        backgroundColor: '#fef3c7',
    },
    confirmed: {
        backgroundColor: '#dbeafe',
    },
    completed: {
        backgroundColor: '#d1fae5',
    },
    canceled: {
        backgroundColor: '#fecaca',
    },
});
