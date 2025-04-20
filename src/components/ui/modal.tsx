'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import Button from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md' 
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95%] h-[90vh]'
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby={title}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:p-0">
          <div 
            ref={modalRef}
            className={`bg-white rounded-lg ${sizeClasses[size]} w-full mx-auto border border-gray-200`}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <Button 
                variant="icon"
                size="icon" 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 rounded-full p-1"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </Button>
            </div>
            
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
            
            {footer && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;