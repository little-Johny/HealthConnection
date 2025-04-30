import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IoChevronBackOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import MainLayout from '../../components/Layout'
import Button from '../../components/Button'
import PostForm from '../../components/PostForm'
import { createPost } from '../../api/post'
import { useAuth } from '../../hooks/useAuth'

export default function CreatePost() {
    const navigate = useNavigate();
    const { userId } = useAuth(); 

    const handleSubmit = async (values) => {
        try {  
            const allValues = { ...values, userId };
            await createPost(allValues);
            toast.success('Publicacion creada exitosamente');
            navigate(`/dashboard`);
        } catch (error) {
            toast.error('Hubo un error al crear la publicacion');
            console.log(error);
        }
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
            <PostForm onSave={handleSubmit} post={null}/>
        </MainLayout>
    )
}
