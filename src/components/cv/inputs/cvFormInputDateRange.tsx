import Button from '@/components/ui/button';
import { DateRange, DateRangeErrors } from '@/types/cv';

interface CVFormInputDateRangeProps {
  id: string;
  fromValue?: string;
  toValue?: string;
  onChange?: (values: DateRange) => void;
  onRemove?: () => void;
  errors?: DateRangeErrors;
}

const CVFormInputDateRange = ({ 
  id, 
  fromValue = "", 
  toValue = "", 
  onChange,
  onRemove,
  errors
}: CVFormInputDateRangeProps) => {
  const fromId = `${id}-from`;
  const toId = `${id}-to`;
  
  const handleChange = (field: 'from' | 'to') => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      if (field === 'from') {
        onChange({ from: e.target.value, to: toValue });
      } else {
        onChange({ from: fromValue, to: e.target.value });
      }
    }
  };
  
  return (
    <div id={id} className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
      <div className="flex justify-between items-center">
        <div className="font-medium text-green-800">Champ &quot;De / À&quot;</div>
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
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <label htmlFor={fromId} className="block text-sm text-gray-600 mb-1">De</label>
          <input 
            id={fromId}
            type="text" 
            placeholder="Date de début" 
            className={`w-full px-3 py-2 border ${errors?.from ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
            defaultValue={fromValue}
            onChange={handleChange('from')}
          />
          {errors?.from && <p className="mt-1 text-sm text-red-600">{errors.from}</p>}
        </div>
        <div>
          <label htmlFor={toId} className="block text-sm text-gray-600 mb-1">À</label>
          <input 
            id={toId}
            type="text" 
            placeholder="Date de fin" 
            className={`w-full px-3 py-2 border ${errors?.to ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
            defaultValue={toValue}
            onChange={handleChange('to')}
          />
          {errors?.to && <p className="mt-1 text-sm text-red-600">{errors.to}</p>}
        </div>
      </div>
    </div>
  );
};

export default CVFormInputDateRange;