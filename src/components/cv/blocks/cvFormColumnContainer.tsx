'use client';

import { ColumnCount } from '@/types/cv';
import CVFormColumnBlock from '@/components/cv/blocks/cvFormColumnBlock';
import Button from '@/components/ui/button';
import { useCV } from '@/context/cvContext';

interface CVFormColumnContainerProps {
  columns: ColumnCount;
}

const CVFormColumnContainer = ({ columns }: CVFormColumnContainerProps) => {
  const {
    addBlock,
    getBlocksForColumn
  } = useCV();
  
  const gridClass = 
    columns === 1 ? 'grid-cols-1' : 
    columns === 2 ? 'grid-cols-2' : 
    'grid-cols-3';
  
  return (
    <div className={`grid ${gridClass} gap-4 border border-gray-200 p-4 rounded-lg bg-gray-50`}>
      {Array.from({ length: columns }).map((_, columnIndex) => {
        const blocksInColumn = getBlocksForColumn(columnIndex);
        
        return (
          <div key={columnIndex} className="bg-white border border-gray-300 rounded-lg p-4 min-h-40">
            {blocksInColumn.length > 0 ? (
              <div className="mb-4">
                {blocksInColumn.map(block => (
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
                Aucun bloc dans cette colonne
              </div>
            )}
            
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="icon"
                isRounded
                onClick={() => addBlock(columnIndex)}
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
  );
};

export default CVFormColumnContainer;