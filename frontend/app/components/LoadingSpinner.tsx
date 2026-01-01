import React from 'react';
import { FiLoader } from 'react-icons/fi';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Processing your question...' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <FiLoader className={`${sizeClasses[size]} animate-spin text-primary-600`} />
        <div className="absolute inset-0 animate-ping opacity-25">
          <FiLoader className={`${sizeClasses[size]} text-primary-600`} />
        </div>
      </div>
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-center animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;