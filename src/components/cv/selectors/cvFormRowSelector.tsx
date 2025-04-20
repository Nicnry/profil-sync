import { RowCount } from '@/types/cv';

interface CVFormRowSelectorProps {
  value: RowCount;
  onChange: (rows: RowCount) => void;
}

const CVFormRowSelector = ({ value, onChange }: CVFormRowSelectorProps) => {
  const selectRows = (rows: RowCount) => {
    onChange(rows);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={() => selectRows(1)}
        className={`p-2 border rounded-md ${
          value === 1 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        aria-label="1 rangée (pleine page)"
        title="1 rangée (pleine page)"
      >
        <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
        </div>
      </button>
      
      <button
        type="button"
        onClick={() => selectRows(2)}
        className={`p-2 border rounded-md ${
          value === 2 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        aria-label="2 rangées (en-tête et contenu)"
        title="2 rangées (en-tête et contenu)"
      >
        <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
          <div className="flex flex-col space-y-px">
            <div className="w-3 h-1 bg-gray-600 rounded-sm"></div>
            <div className="w-3 h-2 bg-gray-600 rounded-sm"></div>
          </div>
        </div>
      </button>
      
      <button
        type="button"
        onClick={() => selectRows(3)}
        className={`p-2 border rounded-md ${
          value === 3 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        aria-label="3 rangées (en-tête, contenu et pied de page)"
        title="3 rangées (en-tête, contenu et pied de page)"
      >
        <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
          <div className="flex flex-col space-y-px">
            <div className="w-3 h-1 bg-gray-600 rounded-sm"></div>
            <div className="w-3 h-2 bg-gray-600 rounded-sm"></div>
            <div className="w-3 h-1 bg-gray-600 rounded-sm"></div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default CVFormRowSelector;