import { useCallback } from 'react';
import { RowCount } from '@/types/cv';

interface RowDescriptionProps {
  rowCount: RowCount;
  selectedRowCount: RowCount;
}

const RowDescription = ({ selectedRowCount }: RowDescriptionProps) => {
  const getRowDescription = useCallback((index: number, totalRows: number) => {
    if (totalRows === 1) return "pleine page";
    if (totalRows === 2) {
      return index === 0 ? "en-tête" : "contenu principal";
    }
    if (totalRows === 3) {
      if (index === 0) return "en-tête";
      if (index === 1) return "contenu principal";
      return "pied de page";
    }
    return `rangée ${index + 1}`;
  }, []);

  return (
    <div className="mt-2 text-xs text-gray-500">
      <ul className="list-disc pl-4">
        {Array.from({ length: selectedRowCount }).map((_, index) => (
          <li key={`row-desc-${index}`}>
            Rangée {index + 1}: {getRowDescription(index, selectedRowCount)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RowDescription;