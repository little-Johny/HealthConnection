import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IoChevronBackOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useAuth } from './../../hooks/useAuth';
import { getSpecialities } from './../../api/speciality';
import { createPatient } from './../../api/patient';
import { createDoctor } from './../../api/doctor';
import { createUser } from './../../api/user';
import MainLayout from './../../components/Layout';
import Button from './../../components/Button';
import { useEffect, useState } from 'react';

export default function Register() {
    const [specialities, setSpecialities] = useState([]); // Estado para manejar las especialidades
    const [showPassword, setShowPassword] = useState(false); //Estado para la visibilidad de la contraseña
    const [preview, setPreview] = useState(null); // Estado para almacenar la vista previa de la imagen
    const { token, rol } = useAuth();
    const isAdmin = token && rol === 'admin';
    const [selectedRole, setSelectedRole] = useState(isAdmin ? '' : 'patient'); // Estado para configurar el formulario con los campos de cada rol
    const navigate = useNavigate();

    useEffect(() => {
        console.log('ROL:', rol);
    }, [rol]);

    const comunFields = [
        { name: 'photo', type: 'file', initialValue: '', label: 'Foto de perfil' },
        { name: 'username', type: 'text', initialValue: '', label: 'Usuario' },
        { name: 'password', type: 'password', initialValue: '', label: 'Contraseña' },
        { name: 'name', type: 'text', initialValue: '', label: 'Nombre' },
        { name: 'lastName', type: 'text', initialValue: '', label: 'Apellido' },
        {
            name: 'typeDocument',
            type: 'select',
            options: ['C.C.', 'T.I', 'Passport'],
            initialValue: '',
            label: 'Tipo de documento',
        },
        { name: 'numberDocument', type: 'text', initialValue: '', label: 'Número de documento' },
        { 
            name: 'gender', 
            type: 'select', 
            options: ['Male', 'Female'],
            initialValue: '', 
            label: 'Género' 
        },
        { name: 'email', type: 'email', initialValue: '', label: 'Correo electrónico' },
        { name: 'phone', type: 'text', initialValue: '', label: 'Teléfono' },
    ];

    const patientFields = [
        { name: 'birthdate', type: 'date', initialValue: '', label: 'Fecha de nacimiento' },
        { name: 'address', type: 'text', initialValue: '', label: 'Dirección' },
        {
            name: 'city',
            type: 'select',
            options: ['Bogotá', 'Cali', 'Medellín', 'Bucaramanga'],
            initialValue: '',
            label: 'Ciudad',
        },
    ];

    const doctorFields = [
        {
            name: 'specialityId',
            type: 'select',
            fetchOptions: true,
            options: [],
            initialValue: '',
            label: 'Especialidad',
        },
        { name: 'licenseNumber', type: 'text', initialValue: '', label: 'Número de licencia' },
        { name: 'consultationFee', type: 'decimal', initialValue: '', label: 'Tarifa de consulta' },
    ];

    const generateInitialValues = (fields) =>
        fields.reduce((acc, field) => {
            acc[field.name] = field.initialValue;
            return acc;
        }, {});

    const getApiSpecialities = async () => {
        try {
            const response = await getSpecialities();
            const specialities = response.data.data;
            setSpecialities(specialities);
        } catch (error) {
            console.log('error al obtener especialidades: ', error);
            toast.error('No se pudieron cargar las especialidades');
        }
    };

    // Efecto que hará la petición a la API cuando sea necesario
    useEffect(() => {
        if (selectedRole === 'doctor') getApiSpecialities();
    }, [selectedRole]);

    const updatedDoctorFields = doctorFields.map((field) => {
        if (field.name === 'specialityId') {
            return { ...field, options: specialities };
        }
        return field;
    });

    let selectedFields =[...comunFields];

    if (selectedRole === 'doctor') selectedFields.push(...updatedDoctorFields);
    if (selectedRole === 'patient') selectedFields.push(...patientFields);

    const generateValidationSchema = (fields) => {
        const shape = {};

        fields.forEach(({ name, type }) => {
            let rule = Yup.string().required('Este campo es obligatorio');

            // Reglas personalizadas por tipo
            if (type === 'email') {
                rule = Yup.string().email('Correo inválido').required('Este campo es obligatorio');
            }

            if (type === 'number' || type === 'decimal') {
                rule = Yup.number().typeError('Debe ser un número').required('Este campo es obligatorio');
            }

            if (type === 'date') {
                rule = Yup.date().required('Este campo es obligatorio');
            }

            if (type === 'file') {
                rule = Yup.mixed().required('Debe subir un archivo');
            }

            shape[name] = rule;
        });

        return Yup.object().shape(shape);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Asignar el rol desde el filtro (si es admin)
            if (isAdmin && selectedRole) {
                values.role = selectedRole;
            } else {
                values.role ='patient'
            }

            if (selectedRole === 'doctor') {
                await createDoctor(values);
            } else if (selectedRole === 'patient') {
                await createPatient(values);
            } else {
                await createUser(values);
            }
            toast.success('Usuario creado exitosamente');
            navigate('/dashboard'); 
        } catch (error) {
            console.log(`No se pudo crear el ${selectedRole}`, error);
            const { response } = error;
            if (response?.data?.error) {
                const errorData = response.data.error;
            
                if (typeof errorData === 'string') {
                    toast.error(errorData);
                } else if (typeof errorData === 'object') {
                    Object.values(errorData).forEach(errMsg => {
                        toast.error(errMsg);
                    });
                }
            };
            toast.error(`Error al crear`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRoleChange = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
    };

    return (
        <MainLayout containerClass='flex justify-center items-center px-4 py-6'>
            <Button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 bg-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition"
                aria-label="Volver"
            >
                <IoChevronBackOutline className="w-5 h-5" />
            </Button>
            <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6">
                {isAdmin && (
                    <div className={`container mx-auto px-4 pt-6`}>
                        <div className="flex items-center gap-4">
                            <label htmlFor="roleFilter" className="text-sm font-medium">
                                Seleccionar rol para crear:
                            </label>
                            <select
                                id="roleFilter"
                                value={setSelectedRole}
                                onChange={handleRoleChange}
                                className="p-2 border rounded shadow-sm"
                            >
                                <option value="">Todos</option>
                                <option value="admin">Admin</option>
                                <option value="doctor">Doctor</option>
                                <option value="patient">patient</option>
                                <option value="staff">staff</option>
                            </select>
                        </div>
                    </div>
                )}

                {isAdmin && (
                    <p className="text-sm text-gray-600 mb-4">
                        Registrando usuario como <strong>{selectedRole}</strong>
                    </p>
                )}

                <Formik
                    initialValues={generateInitialValues(selectedFields)}
                    validationSchema={generateValidationSchema(selectedFields)}
                    onSubmit={handleSubmit}
                >
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedFields.map(({ name, type, options, label }) => (
                            <div
                            key={name}
                            className={`space-y-2 ${type === 'file' ? 'col-span-2' : ''}`}
                            >
                            <label
                                className="block text-sm font-medium capitalize"
                                htmlFor={name}
                            >
                                {label || name}
                            </label>

                            {type === 'file' ? (
                                <Field name={name}>
                                {({ form }) => (
                                    <>
                                    <input
                                        type="file"
                                        id={name}
                                        name={name}
                                        className="hidden"
                                        onChange={(e) => {
                                        form.setFieldValue(name, e.currentTarget.files[0]);
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                            setPreview(reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                        }}
                                    />
                                    <label
                                        htmlFor={name}
                                        className="w-full flex flex-col items-center border p-3 rounded-md shadow-sm cursor-pointer"
                                    >
                                        <span className="text-gray-600">
                                        Haz clic para seleccionar una foto
                                        </span>
                                        {preview && (
                                        <img
                                            src={preview}
                                            alt="preview"
                                            className="mt-3 w-24 h-24 object-cover rounded-full border-2 border-gray-200"
                                        />
                                        )}
                                    </label>
                                    </>
                                )}
                                </Field>
                            ) : type === 'select' ? (
                                <Field
                                as="select"
                                name={name}
                                id={name}
                                className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                <option value="">Selecciona alguna opción</option>
                                {options?.map((opt) => (
                                    <option
                                    key={typeof opt === 'string' ? opt : opt.id}
                                    value={typeof opt === 'string' ? opt : opt.id}
                                    >
                                    {typeof opt === 'string'
                                        ? opt
                                        : opt.name || opt.nombre}
                                    </option>
                                ))}
                                </Field>
                            ) : name === 'password' ? (
                                <div className="relative">
                                    <Field
                                    type={showPassword ? 'text' : 'password'}
                                    name={name}
                                    id={name}
                                    className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
                                    >
                                        {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                    </Button>
                                </div>
                            ) : (
                                <Field
                                type={type}
                                name={name}
                                id={name}
                                className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            )}
                            <ErrorMessage
                                name={name}
                                component="div"
                                className="text-xs text-red-600"
                            />
                            </div>
                        ))}

                        <div className="col-span-2 flex justify-center">
                            <Button 
                                type="submit" 
                                variant="success" 
                                className="w-full md:w-1/2 px-4"
                            >
                                Registrar
                            </Button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </MainLayout>
    );
}
