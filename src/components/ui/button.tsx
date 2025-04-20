import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: ReactNode;
  isRounded?: boolean;
  className?: string;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  isRounded = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    danger: 'bg-red-500 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    icon: ''
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-2.5 text-lg',
    icon: 'w-8 h-8'
  };
  
  const iconVariantClasses = {
    primary: 'bg-blue-100 text-blue-600 hover:bg-blue-200 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-100 text-red-600 hover:bg-red-200 focus:ring-red-500',
    success: 'bg-green-100 text-green-600 hover:bg-green-200 focus:ring-green-500',
    warning: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 focus:ring-yellow-500',
    icon: ''
  };
  
  const roundedClasses = isRounded ? 'rounded-full' : 'rounded-md';
  
  const variantClass = size === 'icon' ? iconVariantClasses[variant] : variantClasses[variant];
  
  const buttonClasses = `${baseClasses} ${variantClass} ${sizeClasses[size]} ${roundedClasses} ${className}`;
  
  return (
    <button 
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;