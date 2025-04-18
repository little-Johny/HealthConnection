import React from 'react'

export default function Button({
    type = 'button', 
    onClick = ()=> {}, 
    children,
    className, 
    variant = 'primary', 
}) {
    const getVariantStyles = (variant) => {
        switch (variant) {
            case 'primary':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'secondary':
                return 'bg-orange-400 hover:bg-orange-500';
            case 'danger':
                return 'bg-red-500 hover:bg-red-600';
            case 'success':
                return 'bg-green-500 hover:bg-green-600';
            default:
                return 'bg-blue-500 hover:bg-blue-600';
        };
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`py-2 rounded-2xl text-white font-semibold ${getVariantStyles(variant)} ${className}`}
        >
            { children }
        </button>
    );
};
