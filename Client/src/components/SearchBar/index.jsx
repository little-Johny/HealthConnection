import React from 'react'

export default function SearchBar({ placeholder, value, onChange = () => {}, onKeyDown = () => {} }) {
    return (
        <div className="flex justify-end mb-4">
            <input
                type="text"
                placeholder={placeholder}
                className="border border-gray-300 rounded px-4 py-2 w-64"
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
        </div>

    );
};
