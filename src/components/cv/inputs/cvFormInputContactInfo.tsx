import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import { ContactInfo } from '@/types/cv';

interface CVFormInputContactInfoProps {
  id: string;
  defaultValue?: ContactInfo;
  onChange?: (value: ContactInfo) => void;
  onRemove?: () => void;
  errors?: Partial<Record<keyof ContactInfo, string>>;
}

const CVFormInputContactInfo = ({ 
  id, 
  defaultValue = {}, 
  onChange,
  onRemove,
  errors = {}
}: CVFormInputContactInfoProps) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultValue);
  
  useEffect(() => {
    setContactInfo(defaultValue);
  }, [defaultValue]);
  
  const handleChange = (field: keyof ContactInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInfo = {
      ...contactInfo,
      [field]: e.target.value
    };
    
    setContactInfo(updatedInfo);
    
    if (onChange) {
      onChange(updatedInfo);
    }
  };

  return (
    <div id={id} className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
      <div className="flex justify-between items-center mb-3">
        <div className="font-medium text-green-800">Informations de contact</div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${id}-email`} className="block text-sm text-gray-600 mb-1">Email</label>
          <input 
            id={`${id}-email`}
            type="email" 
            placeholder="votre@email.com" 
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
            value={contactInfo.email || ''}
            onChange={handleChange('email')}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor={`${id}-phone`} className="block text-sm text-gray-600 mb-1">Téléphone</label>
          <input 
            id={`${id}-phone`}
            type="tel" 
            placeholder="01 23 45 67 89" 
            className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
            value={contactInfo.phone || ''}
            onChange={handleChange('phone')}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor={`${id}-address`} className="block text-sm text-gray-600 mb-1">Adresse</label>
          <input 
            id={`${id}-address`}
            type="text" 
            placeholder="123 rue des Lilas" 
            className={`w-full px-3 py-2 border ${errors.address ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
            value={contactInfo.address || ''}
            onChange={handleChange('address')}
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>
        
        <div>
          <label htmlFor={`${id}-city`} className="block text-sm text-gray-600 mb-1">Ville</label>
          <input 
            id={`${id}-city`}
            type="text" 
            placeholder="Paris" 
            className={`w-full px-3 py-2 border ${errors.city ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
            value={contactInfo.city || ''}
            onChange={handleChange('city')}
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor={`${id}-postalCode`} className="block text-sm text-gray-600 mb-1">Code postal</label>
            <input 
              id={`${id}-postalCode`}
              type="text" 
              placeholder="75000" 
              className={`w-full px-3 py-2 border ${errors.postalCode ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
              value={contactInfo.postalCode || ''}
              onChange={handleChange('postalCode')}
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
          </div>
          
          <div>
            <label htmlFor={`${id}-country`} className="block text-sm text-gray-600 mb-1">Pays</label>
            <input 
              id={`${id}-country`}
              type="text" 
              placeholder="France" 
              className={`w-full px-3 py-2 border ${errors.country ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
              value={contactInfo.country || ''}
              onChange={handleChange('country')}
            />
            {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVFormInputContactInfo;