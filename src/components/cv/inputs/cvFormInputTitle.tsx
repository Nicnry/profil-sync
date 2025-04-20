import Button from '@/components/ui/button';

interface CVFormInputTitleProps {
  id: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onRemove?: () => void;
  error?: string;
}

const CVFormInputTitle = ({ 
  id, 
  defaultValue = "", 
  onChange,
  onRemove,
  error
}: CVFormInputTitleProps) => {
  const inputId = `${id}-input`;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div id={id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
      <div className="flex justify-between items-center">
        <label htmlFor={inputId} className="font-medium text-yellow-800">Champ de titre</label>
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
          id={inputId}
          type="text"
          placeholder="Titre"
          className={`w-full px-3 py-2 border ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-yellow-500'} rounded-md focus:outline-none focus:ring-2`}
          defaultValue={defaultValue}
          onChange={handleChange}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default CVFormInputTitle;