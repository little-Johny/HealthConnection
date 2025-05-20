import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UserCard({ user }) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                {user.photo && user.photo !== "null" ? (
                    <Image source={{ uri: user.photo }} style={styles.avatar} />
                ) : (
                    <Ionicons name="person-circle-outline" size={64} color="#9ca3af" />
                )}
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{user.name} {user.lastName}</Text>
                    <Text style={styles.username}>@{user.username}</Text>
                </View>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Documento:</Text>
                <Text style={styles.value}>{user.typeDocument} {user.numberDocument}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Teléfono:</Text>
                <Text style={styles.value}>{user.phone}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Rol:</Text>
                <Text style={styles.value}>{user.role}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Registrado el:</Text>
                <Text style={styles.value}>
                    {new Date(user.createdAt).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f3f4f6', // Gris claro para el fondo
        borderRadius: 12,
        padding: 20, // Un poco más de espacio
        shadowColor: '#000',
        shadowOpacity: 0.15, // Sombra más difusa
        shadowRadius: 12, // Sombra más gruesa
        elevation: 10, // Sombra más pronunciada en Android
        margin: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 12,
    },
    nameContainer: {
        flexShrink: 1,
    },
    name: {
        fontSize: 20, // Aumentamos el tamaño de la fuente
        fontWeight: 'bold',
        color: '#1f2937', // Color más oscuro para mejor contraste
    },
    username: {
        color: '#6b7280', // Mantiene el color gris para el nombre de usuario
        fontSize: 16, // Ajuste de tamaño de fuente para una mejor legibilidad
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12, // Más espacio entre las filas
    },
    label: {
        fontWeight: 'bold',
        width: 120, // Más espacio para las etiquetas
        color: '#374151',
        fontSize: 16, // Ajuste de tamaño para las etiquetas
    },
    value: {
        color: '#374151',
        flex: 1,
        fontSize: 16, // Ajuste de tamaño de texto
    },
});
