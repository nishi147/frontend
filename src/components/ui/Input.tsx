import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-4 focus:ring-primary-100 transition-all outline-none ${className}`}
      {...props}
    />
  );
};
