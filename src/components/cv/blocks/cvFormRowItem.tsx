'use client';

import { useCV } from '@/context/cvContext';
import CVFormColumnSelector from '@/components/cv/selectors/cvFormColumnSelector';
import CVFormColumnItem from '@/components/cv/blocks/cvFormColumnItem';
import { ColumnCount } from '@/types/cv';

interface CVFormRowItemProps {
  rowIndex: number;
  rowLabel: string;
}

const CVFormRowItem = ({ rowIndex, rowLabel }: CVFormRowItemProps) => {
  const { getColumnsForRow, setColumnsForRow } = useCV();
  
  const columns = getColumnsForRow(rowIndex);
  
  const handleColumnChange = (newColumns: ColumnCount) => {
    setColumnsForRow(rowIndex, newColumns);
  };
  
  const getRowHeightClass = () => {
    if (rowLabel === 'En-tête' || rowLabel === 'Pied de page') {
      return 'min-h-32';
    }
    return 'min-h-64';
  };
  
  const getGridClass = () => {
    if (columns === 1) return 'grid-cols-1';
    if (columns === 2) return 'grid-cols-2';
    return 'grid-cols-3';
  };
  
  return (
    <div className="border-b last:border-b-0 border-gray-200 bg-white">
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-3">
        <h3 className="font-medium text-gray-700">
          {rowLabel}
        </h3>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 mr-2">Colonnes:</span>
          <CVFormColumnSelector 
            value={columns} 
            onChange={handleColumnChange} 
          />
        </div>
      </div>
      
      <div className={`p-4 ${getRowHeightClass()}`}>
        <div className={`grid ${getGridClass()} gap-4 h-full`}>
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <CVFormColumnItem 
              key={`row-${rowIndex}-col-${columnIndex}`}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CVFormRowItem;