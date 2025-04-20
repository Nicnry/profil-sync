'use client';

import { useState, useCallback, useEffect } from 'react';
import { BlockInfo, NestedBlockInfo, ComponentInfo, ComponentType } from '@/types/cv';
import { generateId, cloneBlocks } from '@/utils/helpers';

interface UseCVBlockManagementProps {
  initialBlocks?: BlockInfo[];
  onChange?: (blocks: BlockInfo[]) => void;
}

interface UseCVBlockManagementReturn {
  blocks: BlockInfo[];
  addBlock: (columnIndex: number, title?: string) => void;
  removeBlock: (blockId: string) => void;
  updateBlockTitle: (blockId: string, newTitle: string) => void;
  addNestedBlock: (parentId: string, title?: string) => void;
  removeNestedBlock: (parentId: string, childId: string) => void;
  updateNestedBlockTitle: (parentId: string, childId: string, newTitle: string) => void;
  addComponent: (blockId: string, componentType: ComponentType) => void;
  removeComponent: (blockId: string, componentId: string) => void;
  updateComponentProps: (blockId: string, componentId: string, newProps: Record<string, string>) => void;
  getBlocksForColumn: (columnIndex: number) => BlockInfo[];
}

const useCVBlockManagement = ({
  initialBlocks = [],
  onChange
}: UseCVBlockManagementProps = {}): UseCVBlockManagementReturn => {
  const [blocks, setBlocks] = useState<BlockInfo[]>(initialBlocks);
  
  useEffect(() => {
    if (onChange) {
      onChange(blocks);
    }
  }, [blocks, onChange]);
  
  const addBlock = useCallback((columnIndex: number, title?: string) => {
    const newBlock: BlockInfo = {
      id: generateId('block'),
      title: title || `Bloc ${blocks.length + 1}`,
      columnIndex,
      children: [],
      components: []
    };
    
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
  }, [blocks.length]);
  
  const removeBlock = useCallback((blockId: string) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
  }, []);
  
  const updateBlockTitle = useCallback((blockId: string, newTitle: string) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === blockId ? { ...block, title: newTitle } : block
      )
    );
  }, []);
  
  const addNestedBlock = useCallback((parentId: string, title?: string) => {
    const newChild: NestedBlockInfo = {
      id: generateId('nested'),
      title: title || 'Sous-bloc',
      children: [],
      components: []
    };
    
    setBlocks(prevBlocks => {
      const updatedBlocks = cloneBlocks(prevBlocks);
      
      const findAndAddChild = (blocks: BlockInfo[] | NestedBlockInfo[]): boolean => {
        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          
          if (block.id === parentId) {
            block.children = [...block.children, newChild];
            return true;
          }
          
          if (block.children.length > 0) {
            const foundInChildren = findAndAddChild(block.children);
            if (foundInChildren) return true;
          }
        }
        
        return false;
      };
      
      findAndAddChild(updatedBlocks);
      return updatedBlocks;
    });
  }, []);
  
  const removeNestedBlock = useCallback((parentId: string, childId: string) => {
    setBlocks(prevBlocks => {
      const updatedBlocks = cloneBlocks(prevBlocks);
      
      const findAndRemoveChild = (blocks: BlockInfo[] | NestedBlockInfo[]): boolean => {
        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          
          if (block.id === parentId) {
            block.children = block.children.filter(child => child.id !== childId);
            return true;
          }
          
          if (block.children.length > 0) {
            const foundInChildren = findAndRemoveChild(block.children);
            if (foundInChildren) return true;
          }
        }
        
        return false;
      };
      
      findAndRemoveChild(updatedBlocks);
      return updatedBlocks;
    });
  }, []);
  
  const updateNestedBlockTitle = useCallback((parentId: string, childId: string, newTitle: string) => {
    setBlocks(prevBlocks => {
      const updatedBlocks = cloneBlocks(prevBlocks);
      
      const findAndUpdateChildTitle = (blocks: BlockInfo[] | NestedBlockInfo[]): boolean => {
        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          
          if (block.id === parentId) {
            for (let j = 0; j < block.children.length; j++) {
              if (block.children[j].id === childId) {
                block.children[j].title = newTitle;
                return true;
              }
            }
          }
          
          if (block.children.length > 0) {
            const foundInChildren = findAndUpdateChildTitle(block.children);
            if (foundInChildren) return true;
          }
        }
        
        return false;
      };
      
      findAndUpdateChildTitle(updatedBlocks);
      return updatedBlocks;
    });
  }, []);
  
  const addComponent = useCallback((blockId: string, componentType: ComponentType) => {
    const newComponent: ComponentInfo = {
      id: generateId('comp'),
      type: componentType,
      props: {}
    };
    
    setBlocks(prevBlocks => {
      const updatedBlocks = cloneBlocks(prevBlocks);
      
      const findAndAddComponent = (blocks: BlockInfo[] | NestedBlockInfo[]): boolean => {
        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          
          if (block.id === blockId) {
            block.components = [...(block.components || []), newComponent];
            return true;
          }
          
          if (block.children.length > 0) {
            const foundInChildren = findAndAddComponent(block.children);
            if (foundInChildren) return true;
          }
        }
        
        return false;
      };
      
      findAndAddComponent(updatedBlocks);
      return updatedBlocks;
    });
  }, []);
  
  const removeComponent = useCallback((blockId: string, componentId: string) => {
    setBlocks(prevBlocks => {
      const updatedBlocks = cloneBlocks(prevBlocks);
      
      const findAndRemoveComponent = (blocks: BlockInfo[] | NestedBlockInfo[]): boolean => {
        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          
          if (block.id === blockId && block.components) {
            block.components = block.components.filter(comp => comp.id !== componentId);
            return true;
          }
          
          if (block.children.length > 0) {
            const foundInChildren = findAndRemoveComponent(block.children);
            if (foundInChildren) return true;
          }
        }
        
        return false;
      };
      
      findAndRemoveComponent(updatedBlocks);
      return updatedBlocks;
    });
  }, []);
  
  const updateComponentProps = useCallback((blockId: string, componentId: string, newProps: Record<string, string>) => {
    setBlocks(prevBlocks => {
      const updatedBlocks = cloneBlocks(prevBlocks);
      
      const findAndUpdateComponent = (blocks: BlockInfo[] | NestedBlockInfo[]): boolean => {
        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          
          if (block.id === blockId && block.components) {
            for (let j = 0; j < block.components.length; j++) {
              if (block.components[j].id === componentId) {
                block.components[j].props = { 
                  ...(block.components[j].props || {}), 
                  ...newProps 
                };
                return true;
              }
            }
          }
          
          if (block.children.length > 0) {
            const foundInChildren = findAndUpdateComponent(block.children);
            if (foundInChildren) return true;
          }
        }
        
        return false;
      };
      
      findAndUpdateComponent(updatedBlocks);
      return updatedBlocks;
    });
  }, []);
  
  const getBlocksForColumn = useCallback((columnIndex: number) => {
    return blocks.filter(block => block.columnIndex === columnIndex);
  }, [blocks]);
  
  return {
    blocks,
    addBlock,
    removeBlock,
    updateBlockTitle,
    addNestedBlock,
    removeNestedBlock,
    updateNestedBlockTitle,
    addComponent,
    removeComponent,
    updateComponentProps,
    getBlocksForColumn
  };
};

export default useCVBlockManagement;