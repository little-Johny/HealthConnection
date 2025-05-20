import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { getAppointments } from '../api/appointment';
import { getUserProfile } from '../api/user';
import AppointmentCard from '../components/AppointmentCard'; // Asegúrate que la ruta esté bien

export default function AppointmentScreen() {
    const [appointments, setAppointments] = useState([]);
    const { userId } = useAuth();

    const getUserAppointments = async () => {
        try {
            const profile = await getUserProfile(userId);
            const name = profile.data.data.name;
            const response = await getAppointments({ patient: name });
            const { appointments } = response.data.data;
            setAppointments(appointments);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar tus citas.');
        }
    };

    useEffect(() => {
        getUserAppointments();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <AppointmentCard appointment={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
});
