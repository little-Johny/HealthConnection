import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoChevronBackOutline, IoPerson } from "react-icons/io5";
import { CircularProgress } from "@mui/material"; 
import { toast } from "react-toastify";
import { getUserById, getUserProfile, partiallyUpdateUser } from "./../../api/user";
import UserEditForm from "./../../components/UserEditForm";
import MainLayout from "./../../components/Layout";
import UserCard from "./../../components/UserCard";
import Button from "../../components/Button";

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // Estado para el modal
    const { userId } = useParams();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setUser(null);

            try {
                let response;
                if (userId) {
                    response = await getUserById(userId);
                } else {
                    response = await getUserProfile();
                }

                setTimeout(() => {
                    setUser(response.data.data);
                    setLoading(false);
                }, 2000); // Delay intencional
            } catch (error) {
                console.error("Error al obtener el perfil:", error);
                toast.error("No se pudo cargar el perfil");
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleUpdate = async (updatedData) => {
        try {
            const response = await partiallyUpdateUser(user.id, updatedData);
            setUser(response.data.data); // Actualiza con los nuevos datos
            toast.success("Perfil actualizado correctamente");
            setShowModal(false);
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            toast.error("Error al actualizar el perfil");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    return (
        <MainLayout LayoutClass="bg-gray-300">
            <header className='bg-orange-400 p-6 shadow-lg shadow-gray-500'>
                <div className='flex justify-between items-center'>
                    <Button
                        onClick={() => navigate(-1)}
                        className="absolute text-white p-2 rounded-full shadow-md transition"
                    >
                        <IoChevronBackOutline className="w-5 h-5" />
                    </Button>

                    <h1 className='text-white text-3xl font-semibold flex-grow text-center'>
                        Perfil de {user.username}
                    </h1>

                    <Button
                        onClick={() => navigate('/profile')}
                        className='bg-slate-400 text-white p-2 rounded-full hover:bg-slate-600'
                    >
                        <IoPerson size={24} />
                    </Button>
                </div>
            </header>

            <div className="flex justify-center px-4 py-8">
                <div className="w-full max-w-lg">
                    <UserCard user={user} />

                    <Button
                        onClick={() => setShowModal(true)}
                        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Editar Perfil
                    </Button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                            onClick={() => setShowModal(false)}
                        >
                            ✕
                        </button>
                        <UserEditForm user={user} onSubmit={handleUpdate} />
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
