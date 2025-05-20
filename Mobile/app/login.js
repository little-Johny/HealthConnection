import React from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import { login as loginRequest } from '../api/auth';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('El usuario es obligatorio'),
        password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await loginRequest(values);
            const token = response.data.data;
            login(token);
            setTimeout(() => {
                setSubmitting(false);
                router.push('/dashboard');
            }, 1000);
        } catch (error) {
            console.error('Error al iniciar sesión', error);
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                    <View style={styles.form}>
                        <Text style={styles.label}>Usuario</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingresa tu usuario"
                            placeholderTextColor="#888"
                            autoCapitalize="none"
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            value={values.username}
                        />
                        {touched.username && errors.username && (
                            <Text style={styles.errorText}>{errors.username}</Text>
                        )}

                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingresa tu contraseña"
                            placeholderTextColor="#888"
                            secureTextEntry
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                        />
                        {touched.password && errors.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}

                        <TouchableOpacity
                            style={[styles.button, isSubmitting && { opacity: 0.6 }]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.buttonText}>
                                {isSubmitting ? 'Cargando...' : 'Iniciar sesión'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ff822b',
        textAlign: 'center',
        marginBottom: 32,
    },
    form: {
        width: '100%',
    },
    input: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        color: '#111',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    errorText: {
        color: '#e63946',
        marginBottom: 10,
        fontSize: 12,
    },
    button: {
        backgroundColor: '#ff822b',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
