import { BlockInfo, NestedBlockInfo } from '@/types/cv';

interface BlockDebugListProps {
  blocks: BlockInfo[];
}

const BlockDebugList = ({ blocks }: BlockDebugListProps) => {
  const renderBlockDebugList = (blocks: BlockInfo[] | NestedBlockInfo[], depth = 0) => {
    return blocks.map(block => (
      <li key={block.id} className="ml-4">
        {'  '.repeat(depth)}• {'columnIndex' in block ? `Colonne ${(block as BlockInfo).columnIndex + 1}: ` : ''}{block.title || 'Sans titre'}
        {block.components && block.components.length > 0 && (
          <span className="text-purple-600 text-xs ml-2">
            ({block.components.length} champ{block.components.length > 1 ? 's' : ''})
          </span>
        )}
        
        {block.children && block.children.length > 0 && (
          <ul className="text-xs text-gray-600 space-y-1 ml-4">
            {block.children.map(child => (
              <li key={child.id}>
                {'  '.repeat(depth + 1)}◦ {child.title || 'Sans titre'}
                {child.components && child.components.length > 0 && (
                  <span className="text-purple-600 text-xs ml-2">
                    ({child.components.length} champ{child.components.length > 1 ? 's' : ''})
                  </span>
                )}
                
                {child.children && child.children.length > 0 && (
                  <ul className="text-xs text-gray-600 space-y-1 ml-4">
                    {child.children.map(grandChild => (
                      <li key={grandChild.id}>
                        {'  '.repeat(depth + 2)}▪ {grandChild.title || 'Sans titre'}
                        {grandChild.components && grandChild.components.length > 0 && (
                          <span className="text-purple-600 text-xs ml-2">
                            ({grandChild.components.length} champ{grandChild.components.length > 1 ? 's' : ''})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <ul className="text-xs text-gray-600 space-y-1">
      {renderBlockDebugList(blocks)}
    </ul>
  );
};

export default BlockDebugList;