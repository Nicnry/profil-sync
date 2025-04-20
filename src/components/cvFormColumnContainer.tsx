'use client';

import { useState, useEffect, useRef } from 'react';
import { ColumnCount } from '@/components/cvFormColumnSelector';
import CVFormColumnBlock from '@/components/cvFormColumnBlock';
import { ComponentType, ComponentInfo, NestedBlockInfo } from '@/components/componentTypes';

interface CVFormColumnContainerProps {
  columns: ColumnCount;
  onChange: (blocks: BlockInfo[]) => void;
}

const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

export interface BlockInfo {
  id: string;
  title: string;
  columnIndex: number;
  children: NestedBlockInfo[];
  components: ComponentInfo[];
}

const CVFormColumnContainer = ({ columns, onChange }: CVFormColumnContainerProps) => {
  const [columnBlocks, setColumnBlocks] = useState<BlockInfo[]>([]);
  const isFirstRender = useRef(true);
  
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    onChange(columnBlocks);
  }, [columnBlocks, onChange]);
  
  const gridClass = 
    columns === 1 ? 'grid-cols-1' : 
    columns === 2 ? 'grid-cols-2' : 
    'grid-cols-3';
  
  const addBlockToColumn = (columnIndex: number) => {
    const newBlock: BlockInfo = {
      id: generateId(),
      title: `Bloc ${columnBlocks.length + 1}`,
      columnIndex,
      children: [],
      components: []
    };
    
    setColumnBlocks([...columnBlocks, newBlock]);
  };
  
  const removeBlock = (blockId: string) => {
    setColumnBlocks(columnBlocks.filter(block => block.id !== blockId));
  };
  
  const updateBlockTitle = (blockId: string, newTitle: string) => {
    setColumnBlocks(
      columnBlocks.map(block => 
        block.id === blockId ? { ...block, title: newTitle } : block
      )
    );
  };
  
  const addComponentToBlock = (blockId: string, componentType: ComponentType) => {
    const newComponent: ComponentInfo = {
      id: generateId(),
      type: componentType,
      props: {}
    };
    
    setColumnBlocks(
      columnBlocks.map(block => {
        if (block.id === blockId) {
          return { 
            ...block, 
            components: [...block.components, newComponent] 
          };
        }
        
        const updatedChildren = findAndAddComponentToNestedBlock(block.children, blockId, newComponent);
        if (updatedChildren !== block.children) {
          return { ...block, children: updatedChildren };
        }
        
        return block;
      })
    );
  };
  
  const findAndAddComponentToNestedBlock = (
    blocks: NestedBlockInfo[],
    blockId: string,
    newComponent: ComponentInfo
  ): NestedBlockInfo[] => {
    return blocks.map(block => {
      if (block.id === blockId) {
        return { 
          ...block, 
          components: block.components ? [...block.components, newComponent] : [newComponent] 
        };
      }
      
      if (block.children && block.children.length > 0) {
        const updatedChildren = findAndAddComponentToNestedBlock(block.children, blockId, newComponent);
        if (updatedChildren !== block.children) {
          return { ...block, children: updatedChildren };
        }
      }
      
      return block;
    });
  };
  
  const removeComponentFromBlock = (blockId: string, componentId: string) => {
    setColumnBlocks(
      columnBlocks.map(block => {
        if (block.id === blockId) {
          return {
            ...block,
            components: block.components.filter(comp => comp.id !== componentId)
          };
        }
        
        const updatedChildren = findAndRemoveComponentFromNestedBlock(block.children, blockId, componentId);
        if (updatedChildren !== block.children) {
          return { ...block, children: updatedChildren };
        }
        
        return block;
      })
    );
  };
  
  const findAndRemoveComponentFromNestedBlock = (
    blocks: NestedBlockInfo[],
    blockId: string,
    componentId: string
  ): NestedBlockInfo[] => {
    return blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          components: block.components ? block.components.filter(comp => comp.id !== componentId) : []
        };
      }
      
      if (block.children && block.children.length > 0) {
        const updatedChildren = findAndRemoveComponentFromNestedBlock(block.children, blockId, componentId);
        if (updatedChildren !== block.children) {
          return { ...block, children: updatedChildren };
        }
      }
      
      return block;
    });
  };
  
  const updateComponentProps = (blockId: string, componentId: string, newProps: Record<string, string>) => {
    setColumnBlocks(
      columnBlocks.map(block => {
        if (block.id === blockId) {
          return {
            ...block,
            components: block.components.map(comp => {
              if (comp.id === componentId) {
                return {
                  ...comp,
                  props: { ...comp.props, ...newProps }
                };
              }
              return comp;
            })
          };
        }
        
        const updatedChildren = findAndUpdateComponentPropsInNestedBlock(block.children, blockId, componentId, newProps);
        if (updatedChildren !== block.children) {
          return { ...block, children: updatedChildren };
        }
        
        return block;
      })
    );
  };
  
  const findAndUpdateComponentPropsInNestedBlock = (
    blocks: NestedBlockInfo[],
    blockId: string,
    componentId: string,
    newProps: Record<string, string>
  ): NestedBlockInfo[] => {
    return blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          components: block.components ? block.components.map(comp => {
            if (comp.id === componentId) {
              return {
                ...comp,
                props: { ...comp.props, ...newProps }
              };
            }
            return comp;
          }) : []
        };
      }
      
      if (block.children && block.children.length > 0) {
        const updatedChildren = findAndUpdateComponentPropsInNestedBlock(block.children, blockId, componentId, newProps);
        if (updatedChildren !== block.children) {
          return { ...block, children: updatedChildren };
        }
      }
      
      return block;
    });
  };
  
  const addChildToBlock = (parentId: string) => {
    const newChild: NestedBlockInfo = {
      id: generateId(),
      title: 'Sous-bloc',
      children: [],
      components: []
    };
    
    setColumnBlocks(
      columnBlocks.map(block => {
        if (block.id === parentId) {
          return { ...block, children: [...block.children, newChild] };
        }
        
        const updatedChildren = findAndAddChildToNestedBlock(block.children, parentId, newChild);
        if (updatedChildren !== block.children) {
          return { ...block, children: updatedChildren };
        }
        
        return block;
      })
    );
  };
  
  const findAndAddChildToNestedBlock = (
    blocks: NestedBlockInfo[],
    parentId: string,
    newChild: NestedBlockInfo
  ): NestedBlockInfo[] => {
    return blocks.map(block => {
      if (block.id === parentId) {
        return { ...block, children: [...block.children, newChild] };
      }
      
      if (block.children.length > 0) {
        const updatedChildren = findAndAddChildToNestedBlock(block.children, parentId, newChild);
        if (updatedChildren !== block.children) {
          return { ...block, children: updatedChildren };
        }
      }
      
      return block;
    });
  };
  
  const removeChildFromBlock = (parentId: string, childId: string) => {
    setColumnBlocks(
      columnBlocks.map(block => {
        if (block.id === parentId) {
          return {
            ...block,
            children: block.children.filter(child => child.id !== childId)
          };
        }
        
        const updatedChildren = findAndRemoveChildFromNestedBlock(block.children, parentId, childId);
        if (updatedChildren !== block.children) {
          return { ...block, children: updatedChildren };
        }
        
        return block;
      })
    );
  };
  
  const findAndRemoveChildFromNestedBlock = (
    blocks: NestedBlockInfo[],
    parentId: string,
    childId: string
  ): NestedBlockInfo[] => {
    return blocks.map(block => {
      if (block.id === parentId) {
        return {
          ...block,
          children: block.children.filter(child => child.id !== childId)
        };
      }
      
      if (block.children.length > 0) {
        const updatedChildren = findAndRemoveChildFromNestedBlock(block.children, parentId, childId);
        if (updatedChildren !== block.children) {
          return { ...block, children: updatedChildren };
        }
      }
      
      return block;
    });
  };
  
  const updateChildTitle = (parentId: string, childId: string, newTitle: string) => {
    setColumnBlocks(
      columnBlocks.map(block => {
        if (block.id === parentId) {
          return {
            ...block,
            children: block.children.map(child => 
              child.id === childId ? { ...child, title: newTitle } : child
            )
          };
        }
        
        const updatedChildren = findAndUpdateChildTitleInNestedBlock(block.children, parentId, childId, newTitle);
        if (updatedChildren !== block.children) {
          return { ...block, children: updatedChildren };
        }
        
        return block;
      })
    );
  };
  
  const findAndUpdateChildTitleInNestedBlock = (
    blocks: NestedBlockInfo[],
    parentId: string,
    childId: string,
    newTitle: string
  ): NestedBlockInfo[] => {
    return blocks.map(block => {
      if (block.id === parentId) {
        return {
          ...block,
          children: block.children.map(child => 
            child.id === childId ? { ...child, title: newTitle } : child
          )
        };
      }
      
      if (block.children.length > 0) {
        const updatedChildren = findAndUpdateChildTitleInNestedBlock(block.children, parentId, childId, newTitle);
        if (updatedChildren !== block.children) {
          return { ...block, children: updatedChildren };
        }
      }
      
      return block;
    });
  };
  
  const getBlocksForColumn = (columnIndex: number) => {
    return columnBlocks.filter(block => block.columnIndex === columnIndex);
  };
  
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
                    onTitleChange={updateBlockTitle}
                    onRemove={() => removeBlock(block.id)}
                    onAddChild={addChildToBlock}
                    onRemoveChild={removeChildFromBlock}
                    onChildTitleChange={updateChildTitle}
                    onAddComponent={addComponentToBlock}
                    onRemoveComponent={removeComponentFromBlock}
                    onUpdateComponentProps={updateComponentProps}
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center mb-4">
                Aucun bloc dans cette colonne
              </div>
            )}
            
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => addBlockToColumn(columnIndex)}
                className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Ajouter un bloc"
                title="Ajouter un bloc"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CVFormColumnContainer;