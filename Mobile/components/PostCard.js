import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function PublicationCard({ post }) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{post.title}</Text>

            <Image
                source={{ uri: post.image }}
                style={styles.image}
                resizeMode="cover"
            />

            <Text style={styles.content}>{post.content}</Text>

            <Text style={styles.date}>
                Publicado el {new Date(post.createdAt).toLocaleDateString()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        padding: 16,
        marginBottom: 16,
        marginHorizontal: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#ff822b', // Color azul
    },
    image: {
        width: '100%',
        height: 192, 
        borderRadius: 16,
        marginBottom: 12,
    },
    content: {
        fontSize: 14,
        color: '#4B5563', // Gris oscuro
        marginBottom: 8,
    },
    date: {
        fontSize: 10,
        color: '#9CA3AF', // Gris claro
    },
});
