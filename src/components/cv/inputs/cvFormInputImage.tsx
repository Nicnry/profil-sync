import { useState, useRef } from 'react';
import Button from '@/components/ui/button';

interface CVFormInputImageProps {
  id: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onRemove?: () => void;
  error?: string;
}

const CVFormInputImage = ({ 
  id, 
  defaultValue = "", 
  onChange,
  onRemove,
  error
}: CVFormInputImageProps) => {
  const [imagePreview, setImagePreview] = useState<string>(defaultValue);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };
  
  const handleFile = (file?: File) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image.');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 2MB.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      
      if (onChange) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };
  
  const handleRemoveImage = () => {
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (onChange) {
      onChange('');
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div id={id} className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-2">
      <div className="flex justify-between items-center">
        <div className="font-medium text-indigo-800">Photo de profil</div>
        {onRemove && (
          <Button 
            variant="danger"
            size="icon"
            isRounded
            onClick={onRemove}
            aria-label="Supprimer ce champ"
            title="Supprimer ce champ"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </Button>
        )}
      </div>
      
      <div className="mt-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        
        <div 
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-50' 
              : imagePreview 
                ? 'border-indigo-300' 
                : 'border-gray-300 hover:border-indigo-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Aperçu" 
                className="mx-auto max-h-48 rounded" 
              />
              <Button
                variant="danger"
                size="icon"
                isRounded
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute top-1 right-1"
                aria-label="Supprimer l'image"
                title="Supprimer l'image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </Button>
            </div>
          ) : (
            <div className="py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Cliquez ou glissez une image ici
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG ou JPEG (max. 2MB)</p>
            </div>
          )}
        </div>
        
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default CVFormInputImage;