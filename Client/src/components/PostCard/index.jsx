export default function PostCard({ post }) {
    const hasImage = !!post.image;

    return (
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-4 hover:shadow-md transition-all duration-300">
            {hasImage && (
                <img
                    src={typeof post.image === 'string' ? post.image : URL.createObjectURL(post.image)}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg"
                />
            )}

            <div
                className={`flex flex-col gap-2 ${
                    !hasImage ? 'flex-grow justify-center items-center text-center' : ''
                }`}
                style={{ minHeight: !hasImage ? '10rem' : 'auto' }}
            >
                <h3 className="text-lg font-bold text-gray-800">{post.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                    {post.content || 'Sin contenido'}
                </p>
                <div className="flex justify-between items-center mt-2 w-full">
                    {post.createdAt && (
                        <span className="text-xs text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
