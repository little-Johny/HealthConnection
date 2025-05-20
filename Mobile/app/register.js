import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createPatient } from '../api/patient';

export default function RegisterScreen() {
    const router = useRouter();
    const [image, setImage] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [patientId, setPatientId] = useState(null);

    const comunFields = [
        { name: "photo", type: "file", initialValue: "", label: "Foto de perfil" },
        { name: "username", type: "text", initialValue: "", label: "Usuario" },
        { name: "password", type: "password", initialValue: "", label: "Contraseña" },
        { name: "name", type: "text", initialValue: "", label: "Nombre" },
        { name: "lastName", type: "text", initialValue: "", label: "Apellido" },
        {
            name: "typeDocument",
            type: "select",
            options: ["C.C.", "T.I", "Passport"],
            initialValue: "",
            label: "Tipo de documento",
        },
        { name: "numberDocument", type: "text", initialValue: "", label: "Número de documento" },
        {
            name: "gender",
            type: "select",
            options: ["Male", "Female"],
            initialValue: "",
            label: "Género",
        },
        { name: "email", type: "email", initialValue: "", label: "Correo electrónico" },
        { name: "phone", type: "text", initialValue: "", label: "Teléfono" },
    ];

    const patientFields = [
        { name: "birthdate", type: "text", initialValue: "", label: "Fecha de nacimiento" },
        { name: "address", type: "text", initialValue: "", label: "Dirección" },
        {
            name: "city",
            type: "select",
            options: ["Bogotá", "Cali", "Medellín", "Bucaramanga"],
            initialValue: "",
            label: "Ciudad",
        },
    ];

    const selectedFields = [...comunFields, ...patientFields];

    const generateInitialValues = (fields) =>
        fields.reduce((acc, field) => {
            acc[field.name] = field.initialValue;
            return acc;
        }, {});

    const generateValidationSchema = (fields) => {
        const shape = {};
        fields.forEach(({ name, type }) => {
            let rule = Yup.string().required("Campo obligatorio");

            if (type === "email") rule = Yup.string().email("Correo inválido").required("Requerido");
            if (type === "decimal" || type === "number") rule = Yup.number().typeError("Debe ser numérico").required();
            if (type === "file") rule = Yup.mixed().required("Debes subir una imagen");

            shape[name] = rule;
        });
        return Yup.object().shape(shape);
    };

    const pickImage = async (setFieldValue) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const uri = result.assets[0].uri;
            setImage(uri);
            setFieldValue('photo', uri);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        console.log('ENVIANDO VALORES', values);
        try {
            values.role = 'patient';
            const response = await createPatient(values);
            const patient = response.data.data;
            setPatientId(patient.id);
            alert('Paciente registrado exitosamente');
            router.push('/login');
        } catch (error) {
            console.error('Error al registrar paciente:', error);
            const { response } = error;
            if (response?.data?.error) {
                const errorData = response.data.error;
                if (typeof errorData === 'string') {
                    console.error(errorData);
                } else if (typeof errorData === 'object') {
                    Object.values(errorData).forEach(errMsg => {
                        console.error(errMsg);
                    });
                }
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
            <Text style={styles.title}>Registro de Paciente</Text>
            <Formik
                initialValues={generateInitialValues(selectedFields)}
                validationSchema={generateValidationSchema(selectedFields)}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <View style={{ padding: 20 }}>
                        {selectedFields.map((field) => {
                            const { name, type, label, options = [] } = field;

                            if (type === 'file') {
                                return (
                                    <View key={name} style={{ marginBottom: 20 }}>
                                        <Text>{label}</Text>
                                        <TouchableOpacity onPress={() => pickImage(setFieldValue)} style={styles.imagePicker}>
                                            {image ? (
                                                <Image source={{ uri: image }} style={styles.image} />
                                            ) : (
                                                <Text>Seleccionar imagen</Text>
                                            )}
                                        </TouchableOpacity>
                                        {touched[name] && errors[name] && (
                                            <Text style={styles.error}>{errors[name]}</Text>
                                        )}
                                    </View>
                                );
                            }

                            if (type === 'select') {
                                return (
                                    <View key={name} style={{ marginBottom: 20 }}>
                                        <Text>{label}</Text>
                                        <Picker
                                            selectedValue={values[name]}
                                            onValueChange={(value) => setFieldValue(name, value)}
                                        >
                                            <Picker.Item label="Selecciona una opción" value="" />
                                            {options.map((opt, index) => {
                                                const optLabel = typeof opt === 'string' ? opt : opt.name || opt.nombre;
                                                const optValue = typeof opt === 'string' ? opt : opt.id;
                                                return <Picker.Item key={index} label={optLabel} value={optValue} />;
                                            })}
                                        </Picker>
                                        {touched[name] && errors[name] && (
                                            <Text style={styles.error}>{errors[name]}</Text>
                                        )}
                                    </View>
                                );
                            }

                            if (name === 'birthdate') {
                                return (
                                    <View key={name} style={{ marginBottom: 20 }}>
                                        <Text>{label}</Text>
                                        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
                                            <Text>{values[name] ? new Date(values[name]).toLocaleDateString() : 'Seleccionar fecha'}</Text>
                                        </TouchableOpacity>
                                        {showPicker && (
                                            <DateTimePicker
                                                value={values[name] ? new Date(values[name]) : new Date()}
                                                mode="date"
                                                display="default"
                                                maximumDate={new Date()}
                                                onChange={(event, selectedDate) => {
                                                    setShowPicker(Platform.OS === 'ios');
                                                    if (selectedDate) {
                                                        setFieldValue(name, selectedDate.toISOString());
                                                    }
                                                }}
                                            />
                                        )}
                                        {touched[name] && errors[name] && (
                                            <Text style={styles.error}>{errors[name]}</Text>
                                        )}
                                    </View>
                                );
                            }

                            return (
                                <View key={name} style={{ marginBottom: 20 }}>
                                    <Text>{label}</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange(name)}
                                        onBlur={handleBlur(name)}
                                        value={values[name]}
                                        secureTextEntry={type === 'password'}
                                    />
                                    {touched[name] && errors[name] && (
                                        <Text style={styles.error}>{errors[name]}</Text>
                                    )}
                                </View>
                            );
                        })}

                        <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Registrarse</Text>
                        </TouchableOpacity>

                    </View>
                )}
            </Formik>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 40,
        color: '#0f172a', // Slate-900
        marginBottom: 25,
    },
    input: {
        borderWidth: 1,
        borderColor: '#94a3b8', // Slate-400
        backgroundColor: '#f8fafc', // Slate-50
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        marginTop: 8,
    },
    error: {
        color: '#dc2626', // Red-600
        fontSize: 13,
        marginTop: 6,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginTop: 10,
    },
    imagePicker: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#94a3b8', // Slate-400
        borderRadius: 12,
        padding: 15,
        marginTop: 10,
        backgroundColor: '#f1f5f9', // Slate-100
        height: 150,
    },
    buttonContainer: {
        backgroundColor: '#2563eb', // Blue-600
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: '600',
        fontSize: 17,
    },
    label: {
        fontWeight: '600',
        fontSize: 15,
        color: '#334155', // Slate-700
        marginBottom: 6,
        marginTop: 12,
    },
});


