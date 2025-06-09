import { useEffect, useState } from 'react';
import { IoChevronBackOutline } from 'react-icons/io5';
import { deletePost, getAllPost, partiallyUpdate } from '../../api/post';
import MainLayout from '../../components/Layout';
import Modal from './../../components/Modal';
import Button from './../../components/Button';
import { toast } from 'react-toastify';
import PostForm from '../../components/PostForm';
import { useNavigate } from 'react-router-dom';

const PostTable = () => {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 7;
    const navigate = useNavigate();

    const closeModal = () => {
        setShowModal(false);
        setSelectedPost(null);
    };

    const closeEditModal = () => {
        setShowModalEdit(false);
        setSelectedPost(null);
    };

    const getPost = async () => {
        try {
            const response = await getAllPost();
            setPosts(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deactivateHandler = async (id) => {
        try {
            await deletePost(id);
            toast.success('Publicación eliminada exitosamente');
            getPost();
            closeModal();
        } catch (error) {
            console.error(error);
            toast.error('No se puede eliminar la publicación');
        }
    };

    const updateHandle = async (values) => {
        try {
            const filteredValues = {
                title: values.title,
                content: values.content,
                image: values.image,
            };
            await partiallyUpdate(selectedPost.id, filteredValues);
            toast.success('Publicación actualizada correctamente');
            getPost();
            closeEditModal();
        } catch (error) {
            toast.error('No se pudo actualizar la publicación');
            console.error(error.response?.data || error.message);
        }
    };

    useEffect(() => {
        getPost();
    }, []);

    // Cálculo de paginación
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    return (
        <MainLayout className="min-h-screen bg-white">
            <header className="bg-orange-400 p-6 shadow-lg shadow-gray-500">
                <div className="flex justify-between items-center">
                    <Button
                        onClick={() => navigate(-1)}
                        className="absolute text-white p-2 rounded-full shadow-md hover:bg-orange-500 transition"
                    >
                        <IoChevronBackOutline className="w-5 h-5" />
                    </Button>
                    <h1 className="flex-grow text-center text-white text-2xl font-semibold">
                        Lista de publicaciones
                    </h1>
                </div>
            </header>

            <div className="overflow-x-auto rounded-xl shadow border border-gray-200 mt-6 mx-4">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Título</th>
                            <th className="px-6 py-3">Contenido</th>
                            <th className="px-6 py-3">Autor</th>
                            <th className="px-6 py-3">Creado</th>
                            <th className="px-6 py-3">Actualizado</th>
                            <th className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.length > 0 ? (
                            currentPosts.map((post) => (
                                <tr key={post.id} className="border-t hover:bg-gray-50">
                                    <td className="px-6 py-4">{post.id}</td>
                                    <td className="px-6 py-4">{post.title}</td>
                                    <td className="px-6 py-4 line-clamp-2">{post.content}</td>
                                    <td className="px-6 py-4">{post.userId}</td>
                                    <td className="px-6 py-4">{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{new Date(post.updatedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <Button
                                            onClick={() => {
                                                setShowModal(true);
                                                setSelectedPost(post);
                                            }}
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-400 transition"
                                        >
                                            Eliminar
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setShowModalEdit(true);
                                                setSelectedPost(post);
                                            }}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-400 transition"
                                        >
                                            Editar
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    No hay publicaciones registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Controles de paginación */}
            <div className="flex justify-center items-center gap-4 my-6">
                <Button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-400 transition"
                >
                    Anterior
                </Button>
                <span className="text-gray-700">Página {currentPage} de {totalPages}</span>
                <Button
                    onClick={() =>
                        setCurrentPage((prev) =>
                            prev < totalPages ? prev + 1 : prev
                        )
                    }
                    disabled={currentPage === totalPages}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-400 transition"
                >
                    Siguiente
                </Button>
            </div>

            {/* Modal de Confirmación */}
            {showModal && selectedPost && (
                <Modal
                    isOpen={showModal}
                    onClose={closeModal}
                    onConfirm={() => deactivateHandler(selectedPost.id)}
                    type="confirm"
                    title="Eliminar publicación"
                    message={`¿Estás seguro de que deseas eliminar "${selectedPost.title}"?`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                />
            )}

            {/* Modal de Edición */}
            {showModalEdit && selectedPost && (
                <PostForm
                    post={selectedPost}
                    onSave={updateHandle}
                    onCancel={closeEditModal}
                />
            )}
        </MainLayout>
    );
};

export default PostTable;
