'use client';

import { useCV } from '@/context/cvContext';
import CVFormColumnBlock from '@/components/cv/blocks/cvFormColumnBlock';
import Button from '@/components/ui/button';

interface CVFormColumnItemProps {
  rowIndex: number;
  columnIndex: number;
}

const CVFormColumnItem = ({ rowIndex, columnIndex }: CVFormColumnItemProps) => {
  const { addBlock, getBlocksForColumnAndRow } = useCV();
  
  const blocksInColumnAndRow = getBlocksForColumnAndRow(rowIndex, columnIndex);
  
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 h-full flex flex-col">
      <div className="text-xs text-gray-500 mb-2">
        Colonne {columnIndex + 1}
      </div>
      
      {blocksInColumnAndRow.length > 0 ? (
        <div className="flex-grow mb-4">
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
        <div className="text-gray-400 text-center mb-4 flex-grow flex items-center justify-center">
          Aucun bloc dans cette zone
        </div>
      )}
      
      <div className="flex justify-center mt-auto">
        <Button
          variant="primary"
          size="icon"
          isRounded
          onClick={() => addBlock(rowIndex, columnIndex)}
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
};

export default CVFormColumnItem;