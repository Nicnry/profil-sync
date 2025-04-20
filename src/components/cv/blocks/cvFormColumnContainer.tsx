'use client';

import { ColumnCount, RowCount } from '@/types/cv';
import CVFormColumnBlock from '@/components/cv/blocks/cvFormColumnBlock';
import Button from '@/components/ui/button';
import { useCV } from '@/context/cvContext';

interface CVFormColumnContainerProps {
  columns: ColumnCount;
  rows: RowCount;
}

const CVFormColumnContainer = ({ columns, rows }: CVFormColumnContainerProps) => {
  const {
    addBlock,
    getBlocksForColumnAndRow
  } = useCV();
  
  const getRowDescription = (rowIndex: number) => {
    if (rows === 1) return 'Contenu principal';
    if (rows === 2) {
      return rowIndex === 0 ? 'En-tête' : 'Contenu principal';
    }
    if (rows === 3) {
      if (rowIndex === 0) return 'En-tête';
      if (rowIndex === 1) return 'Contenu principal';
      return 'Pied de page';
    }
    return '';
  };
  
  const getRowHeightClass = (rowIndex: number) => {
    if (rows === 1) return 'h-full';
    if (rows === 2) {
      return rowIndex === 0 ? 'h-24' : 'h-auto';
    }
    if (rows === 3) {
      if (rowIndex === 0) return 'h-24';
      if (rowIndex === 1) return 'h-auto';
      return 'h-24';
    }
    return 'h-auto';
  };
  
  const gridClass = 
    columns === 1 ? 'grid-cols-1' : 
    columns === 2 ? 'grid-cols-2' : 
    'grid-cols-3';
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={`row-${rowIndex}`} 
          className={`${getRowHeightClass(rowIndex)} border-b last:border-b-0 border-gray-200`}
        >
          <div className="flex items-center bg-gray-50 border-b border-gray-200 px-4 py-2 mb-2">
            <span className="text-sm font-medium text-gray-700">
              {getRowDescription(rowIndex)}
            </span>
          </div>
          
          <div className={`grid ${gridClass} gap-4 p-4`}>
            {Array.from({ length: columns }).map((_, columnIndex) => {
              const blocksInColumnAndRow = getBlocksForColumnAndRow(columnIndex, rowIndex);
              
              return (
                <div 
                  key={`col-${columnIndex}-row-${rowIndex}`} 
                  className="bg-white border border-gray-300 rounded-lg p-4 min-h-40"
                >
                  <div className="text-xs text-gray-500 mb-2">
                    Colonne {columnIndex + 1}
                  </div>
                  
                  {blocksInColumnAndRow.length > 0 ? (
                    <div className="mb-4">
                      {blocksInColumnAndRow.map(block => (
                        <CVFormColumnBlock 
                          key={block.id}
                          id={block.id}
                          title={block.title} 
                          componentChildren={block.children}
                          components={block.components}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center mb-4">
                      Aucun bloc dans cette zone
                    </div>
                  )}
                  
                  <div className="flex justify-center">
                    <Button
                      variant="primary"
                      size="icon"
                      isRounded
                      onClick={() => addBlock(columnIndex, rowIndex)}
                      aria-label="Ajouter un bloc"
                      title="Ajouter un bloc"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CVFormColumnContainer;