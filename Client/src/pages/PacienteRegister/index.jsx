import { useState } from 'react';
import axios from 'axios';

const PacienteRegister = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nombres: '',
        apellidos: '',
        tipo_documento: '',
        numero_documento: '',
        fecha_nacimiento: '',
        genero: '',
        telefono: '',
        correo: '',
        direccion: '',
        ciudad: '',
    });

    const [photo, setPhoto] = useState(null); // Archivo de la foto
    const [photoPreview, setPhotoPreview] = useState(null); // URL para previsualización

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);

        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPhotoPreview(previewUrl);
        } else {
            setPhotoPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        if (photo) {
            formDataToSend.append('foto', photo);
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/health_connection/v1/paciente/registerPaciente',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Paciente registrado:', response.data);
            alert('Paciente registrado exitosamente');
        } catch (error) {
            console.error('Error al registrar paciente:', error.response?.data || error.message);
            alert('Error al registrar paciente');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-indigo-100 to-indigo-50">
            <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl border border-gray-200">
                <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-8">
                    Registrar Paciente
                </h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {[
                        { label: 'Nombre de Usuario', name: 'username', type: 'text' },
                        { label: 'Contraseña', name: 'password', type: 'password' },
                        { label: 'Nombres', name: 'nombres', type: 'text' },
                        { label: 'Apellidos', name: 'apellidos', type: 'text' },
                        { label: 'Fecha de Nacimiento', name: 'fecha_nacimiento', type: 'date' },
                        { label: 'Género', name: 'genero', type: 'text' },
                        { label: 'Teléfono', name: 'telefono', type: 'tel' },
                        { label: 'Correo Electrónico', name: 'correo', type: 'email' },
                        { label: 'Dirección', name: 'direccion', type: 'text' },
                        { label: 'Ciudad', name: 'ciudad', type: 'text' },
                    ].map((field, idx) => (
                        <div className="mb-6" key={idx}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                placeholder={field.label}
                                className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            />
                        </div>
                    ))}

                    {/* Tipo y Número de Documento */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                            <select
                                name="tipo_documento"
                                value={formData.tipo_documento}
                                onChange={handleChange}
                                className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            >
                                <option value="">Selecciona</option>
                                <option value="DNI">DNI</option>
                                <option value="pasaporte">Pasaporte</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Número de Documento</label>
                            <input
                                type="text"
                                name="numero_documento"
                                value={formData.numero_documento}
                                onChange={handleChange}
                                placeholder="Número de Documento"
                                className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            />
                        </div>
                    </div>

                    {/* Foto */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="block w-full text-gray-600"
                        />
                        {photoPreview && (
                            <div className="mt-4 flex justify-center">
                                <img
                                    src={photoPreview}
                                    alt="Previsualización"
                                    className="w-24 h-24 object-cover rounded-full border-4 border-indigo-500 shadow-md"
                                />
                            </div>
                        )}
                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition"
                    >
                        Registrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PacienteRegister;
