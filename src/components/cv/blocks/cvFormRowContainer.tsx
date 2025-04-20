'use client';

import { useCV } from '@/context/cvContext';
import CVFormRowItem from '@/components/cv/blocks/cvFormRowItem';

const CVFormRowContainer = () => {
  const { rowsConfig } = useCV();
  
  return (
    <div className="space-y-6 border border-gray-200 rounded-lg overflow-hidden">
      {rowsConfig.map((row) => (
        <CVFormRowItem
          key={row.rowIndex}
          rowIndex={row.rowIndex}
          rowLabel={row.label}
        />
      ))}
    </div>
  );
};

export default CVFormRowContainer;