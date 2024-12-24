import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  message: string;
  type?: AlertType;
  onClose: () => void;
  time?: number;
}

const Alert: React.FC<AlertProps> = ({ message, type = 'info', onClose, time = 2 }) => {
  const alertStyles: Record<AlertType, string> = {
    info: 'bg-blue-100 text-blue-900 border-l-4 border-blue-500',
    success: 'bg-green-100 text-green-900 border-l-4 border-green-500',
    warning: 'bg-yellow-100 text-yellow-900 border-l-4 border-yellow-500',
    error: 'bg-red-100 text-red-900 border-l-4 border-red-500',
  };

  useEffect(() => {
    const timer = setTimeout(onClose, time * 1000);
    return () => clearTimeout(timer);
  }, [onClose, time]);

  return (
    <div
      className={`fixed top-16 right-5 transform transition-all duration-500 ease-in-out z-50`}
      style={{ animation: 'fadeInSlide 0.5s' }}
    >
      <div
        className={`flex items-center p-4 mb-4 rounded-lg ${alertStyles[type]} shadow-lg`}
        style={{ minWidth: '280px' }}
      >
        <span
          className={`mr-3 text-lg font-semibold capitalize`}
        >
          {type}:
        </span>
        <div className="flex-1 text-sm font-medium">{message}</div>
        <Button
          aria-label="Close Alert"
          onClick={onClose}
          className="ml-4 bg-transparent text-lg text-gray-600 rounded-full p-1 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          &times;
        </Button>
      </div>
      <style jsx>{`
        @keyframes fadeInSlide {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Alert;
