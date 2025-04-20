export type ColumnCount = 1 | 2 | 3;

interface CVFormColumnSelectorProps {
  value: ColumnCount;
  onChange: (columns: ColumnCount) => void;
}

const CVFormColumnSelector = ({ value, onChange }: CVFormColumnSelectorProps) => {
  const selectColumns = (columns: ColumnCount) => {
    onChange(columns);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={() => selectColumns(1)}
        className={`p-2 border rounded-md ${
          value === 1 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        aria-label="1 colonne"
        title="1 colonne"
      >
        <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
        </div>
      </button>
      
      <button
        type="button"
        onClick={() => selectColumns(2)}
        className={`p-2 border rounded-md ${
          value === 2 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        aria-label="2 colonnes"
        title="2 colonnes"
      >
        <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
          <div className="flex space-x-px">
            <div className="w-1.5 h-3 bg-gray-600 rounded-sm"></div>
            <div className="w-1.5 h-3 bg-gray-600 rounded-sm"></div>
          </div>
        </div>
      </button>
      
      <button
        type="button"
        onClick={() => selectColumns(3)}
        className={`p-2 border rounded-md ${
          value === 3 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        aria-label="3 colonnes"
        title="3 colonnes"
      >
        <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
          <div className="flex space-x-px">
            <div className="w-1 h-3 bg-gray-600 rounded-sm"></div>
            <div className="w-1 h-3 bg-gray-600 rounded-sm"></div>
            <div className="w-1 h-3 bg-gray-600 rounded-sm"></div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default CVFormColumnSelector;