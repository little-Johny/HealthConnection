import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackOutline } from 'react-icons/io5';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdministrativoRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nombres: '',
        apellidos: '',
        tipo_documento: '',
        numero_documento: '',
        genero: '',
        telefono: '',
        correo: '',
        rol: '',
    });

    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);


    useEffect(() => {
        return () => {
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

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

    const validateForm = () => {
        const requiredFields = ['username', 'password', 'nombres', 'apellidos', 'tipo_documento', 'numero_documento', 'genero'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                toast.error(`El campo ${field} es obligatorio`, { position: 'top-right' });
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        if (photo) {
            formDataToSend.append('foto', photo);
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/health_connection/v1/administrativos/registerAdministrativo',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            toast.success('Doctor registrado exitosamente', { position: 'top-right' });
            console.log('Doctor registrado:', response.data.data);
            navigate('/manage-users');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al registrar doctor';
            toast.error(errorMessage, { position: 'top-right' });
            console.error('Error al registrar doctor:', errorMessage);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-200">
            {/* Header */}
            <header className="bg-orange-400 p-6 shadow-lg shadow-gray-500 min-w-full">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-400 focus:ring-2 focus:ring-blue-300 transition"
                    >
                        <IoChevronBackOutline size={24} />
                    </button>
                    <h1 className="flex-grow text-center text-white text-xl font-semibold">
                        Registrar Administrativo
                    </h1>
                </div>
            </header>

            {/* Formulario */}
            <div className="w-full max-w-3xl px-6 py-8 bg-white shadow-lg rounded-lg mt-4">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-200"
                >
                    {[
                        { label: 'Nombre de Usuario', name: 'username', type: 'text' },
                        { label: 'Contraseña', name: 'password', type: 'password' },
                        { label: 'Nombres', name: 'nombres', type: 'text' },
                        { label: 'Apellidos', name: 'apellidos', type: 'text' },
                        { label: 'Teléfono', name: 'telefono', type: 'tel' },
                        { label: 'Correo Electrónico', name: 'correo', type: 'email' },
                        { label: 'Horario', name: 'horario', type: 'text' },
                    ].map((field, idx) => (
                        <div key={idx} className='px-6'>
                            <label className="block text-gray-600 mb-2 font-medium">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            />
                        </div>
                    ))}

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-600 mb-2 font-medium">Tipo de Documento</label>
                            <select
                                name="tipo_documento"
                                value={formData.tipo_documento}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">Selecciona</option>
                                <option value="c.c">C.C</option>
                                <option value="t.i">T.I</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-600 mb-2 font-medium">Número de Documento</label>
                            <input
                                type="text"
                                name="numero_documento"
                                value={formData.numero_documento}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-600 mb-2 font-medium">Rol</label>
                            <select
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">Selecciona</option>
                                <option value="administrador">Administrador</option>
                                <option value="asistente">Asistente</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-600 mb-2 font-medium">Género</label>
                            <select
                                name="genero"
                                value={formData.genero}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">Selecciona</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-2 font-medium">Foto</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="block"
                        />
                        {photoPreview && (
                            <img
                                src={photoPreview}
                                alt="Previsualización"
                                className="mt-4 w-20 h-20 rounded-full shadow-md"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 focus:ring-2 focus:ring-blue-400"
                    >
                        Registrar
                    </button>
                </form>
            </div>

            <ToastContainer />
        </div>
    );
};

export default AdministrativoRegister;
