import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoChevronBackOutline } from 'react-icons/io5';
import MainLayout from './../../components/Layout';
import Button from './../../components/Button';
import ScheduleForm from '../../components/ScheduleForm';
import { createSchedule } from '../../api/schedule';

export default function CreateSchedule() {
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            await createSchedule(values);
            toast.success(`Horario Creado exitosamente`);
            return;
        } catch (error) {
            toast.error(`Hubo un error al crear el horario`);
            console.log(error);
        }
    }

    return (
        <MainLayout>
            <Button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 bg-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition"
                aria-label="Volver"
            >
                <IoChevronBackOutline className="w-5 h-5" />
            </Button>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Crear Horario</h2>
                <ScheduleForm
                    onSubmit={handleSubmit}
                    schedule={null}
                />
            </div>
        </MainLayout>
    );
}