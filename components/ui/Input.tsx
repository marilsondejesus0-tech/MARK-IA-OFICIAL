
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
    return (
        <div>
            {label && <label htmlFor={id} className="block text-sm font-medium text-blue-300 mb-2">{label}</label>}
            <input
                id={id}
                className="w-full bg-[#0a101f] border border-blue-800/70 rounded-md py-2 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                {...props}
            />
        </div>
    );
};

export default Input;
