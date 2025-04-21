'use client';

import { useMemo } from 'react';
import { BlockInfo } from '@/types/cv';
import { countAllBlocks, countAllComponents } from '@/utils/helpers';
import BlockDebugList from '@/components/cv/debug/blockDebugList';

interface DebugSectionProps {
  blocks: BlockInfo[];
}

const DebugSection = ({ blocks }: DebugSectionProps) => {
  const totalBlockCount = useMemo(() => countAllBlocks(blocks), [blocks]);
  const totalComponentCount = useMemo(() => countAllComponents(blocks), [blocks]);
  
  if (blocks.length === 0) return null;
  
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-medium mb-2 text-sm text-gray-700">
        Structure actuelle ({totalBlockCount} blocs, {totalComponentCount} champs)
      </h4>
      <BlockDebugList blocks={blocks} />
    </div>
  );
};

export default DebugSection;