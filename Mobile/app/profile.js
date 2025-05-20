import { View, Text, Alert, StyleSheet, ScrollView, ActivityIndicator, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../api/user';
import UserCard from '../components/userCard';
import { useAuth } from '../hooks/useAuth';

export default function ProfileScreen() {
    const { logout } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        try {
            const response = await getUserProfile();
            setUser(response.data.data);
        } catch (error) {
            Alert.alert('No se puede obtener la información del perfil');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Perfil de Usuario</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#4f46e5" />
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    {user && <UserCard user={user} />}

                    {/* <Button title='cerrar sesion' onPress={() => logout()}/> */}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        paddingTop: 50,
        paddingHorizontal: 16,
        justifyContent: 'flex-start', // Cambiado para alinear más arriba
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 24,
        textAlign: 'center',
    },
    content: {
        flexGrow: 1,
        justifyContent: 'flex-start', // Cambiado para mantener el contenido hacia arriba
        alignItems: 'center', // Centrado horizontal en el ScrollView
        paddingBottom: 30,
    },
});
