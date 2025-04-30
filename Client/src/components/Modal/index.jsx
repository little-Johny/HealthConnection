import Button from "./../Button";

export default function Modal({
    isOpen = false,
    onClose = () => {},
    title = "Confirmación",
    message = "",
    type = "info", // info | confirm | warning | error
    onConfirm = () => {},
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    icon = null,
}) {
    if (!isOpen) return null;

    const getColor = () => {
        switch (type) {
            case "warning":
                return "bg-yellow-100 text-yellow-800";
            case "error":
                return "bg-red-100 text-red-800";
            case "success":
                return "bg-green-100 text-green-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex items-center mb-4">
                    {icon && <span className="mr-2">{icon}</span>}
                    <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
                </div>

                <p className="text-gray-600 mb-6">{message}</p>

                <div className="flex justify-end space-x-3">
                <Button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-400 text-gray-800 hover:bg-gray-300"
                >
                    {cancelText}
                </Button>
                {type === "confirm" && (
                    <Button
                        onClick={onConfirm}
                        className={`px-4 py-2 ${getColor()} hover:opacity-90`}
                    >
                        {confirmText}
                    </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
