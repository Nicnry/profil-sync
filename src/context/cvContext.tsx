'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BlockInfo, NestedBlockInfo, ComponentInfo, ComponentType, ColumnCount, RowCount, CVFormInputs, RowConfig } from '@/types/cv';
import { generateId, cloneBlocks } from '@/utils/helpers';

interface CVContextType {
  blocks: BlockInfo[];
  rowsConfig: RowConfig[];
  isSubmitted: boolean;
  addBlock: (rowIndex: number, columnIndex: number, title?: string) => void;
  removeBlock: (blockId: string) => void;
  updateBlockTitle: (blockId: string, newTitle: string) => void;
  addNestedBlock: (parentId: string, title?: string) => void;
  removeNestedBlock: (parentId: string, childId: string) => void;
  updateNestedBlockTitle: (parentId: string, childId: string, newTitle: string) => void;
  addComponent: (blockId: string, componentType: ComponentType) => void;
  removeComponent: (blockId: string, componentId: string) => void;
  updateComponentProps: (blockId: string, componentId: string, newProps: Record<string, string>) => void;
  getBlocksForRow: (rowIndex: number) => BlockInfo[];
  getBlocksForColumnAndRow: (rowIndex: number, columnIndex: number) => BlockInfo[];
  getRowCount: () => number;
  getColumnsForRow: (rowIndex: number) => ColumnCount;
  setColumnsForRow: (rowIndex: number, columns: ColumnCount) => void;
  setRowCount: (count: RowCount) => void;
  saveCV: (data: Partial<CVFormInputs>) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

interface CVProviderProps {
  children: ReactNode;
  initialBlocks?: BlockInfo[];
  initialRowCount?: RowCount;
}

export const CVProvider: React.FC<CVProviderProps> = ({ 
  children, 
  initialBlocks = [],
  initialRowCount = 1
}) => {
  const [blocks, setBlocks] = useState<BlockInfo[]>(initialBlocks);
  const [rowsConfig, setRowsConfig] = useState<RowConfig[]>(
    Array.from({ length: initialRowCount }, (_, index) => ({
      rowIndex: index,
      columns: 1,
      label: index === 0 ? 'En-tête' : index === initialRowCount - 1 ? 'Pied de page' : 'Contenu principal'
    }))
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const getRowCount = useCallback(() => {
    return rowsConfig.length;
  }, [rowsConfig]);

  const getColumnsForRow = useCallback((rowIndex: number) => {
    const rowConfig = rowsConfig.find(row => row.rowIndex === rowIndex);
    return rowConfig ? rowConfig.columns : 1;
  }, [rowsConfig]);

  const setColumnsForRow = useCallback((rowIndex: number, columns: ColumnCount) => {
    setRowsConfig(prevConfig => {
      const newConfig = [...prevConfig];
      const index = newConfig.findIndex(row => row.rowIndex === rowIndex);
      
      if (index !== -1) {
        newConfig[index] = { ...newConfig[index], columns };
      }
      
      return newConfig;
    });
  }, []);

  const setRowCount = useCallback((count: RowCount) => {
    setRowsConfig(prevConfig => {
      if (count > prevConfig.length) {
        const newRows: RowConfig[] = Array.from(
          { length: count - prevConfig.length }, 
          (_, index) => ({
            rowIndex: prevConfig.length + index,
            columns: 1,
            label: prevConfig.length + index === count - 1 ? 'Pied de page' : 'Contenu principal'
          })
        );
        return [...prevConfig, ...newRows];
      }
      
      if (count < prevConfig.length) {
        setBlocks(prevBlocks => 
          prevBlocks.filter(block => block.rowIndex < count)
        );
        
        return prevConfig.slice(0, count);
      }
      
      return prevConfig;
    });
  }, []);

  const getBlocksForRow = useCallback((rowIndex: number) => {
    return blocks.filter(block => block.rowIndex === rowIndex);
  }, [blocks]);

  const getBlocksForColumnAndRow = useCallback((rowIndex: number, columnIndex: number) => {
    return blocks.filter(block => block.rowIndex === rowIndex && block.columnIndex === columnIndex);
  }, [blocks]);

  const addBlock = useCallback((rowIndex: number, columnIndex: number, title?: string) => {
    const newBlock: BlockInfo = {
      id: generateId('block'),
      title: title || `Bloc ${blocks.length + 1}`,
      rowIndex,
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

  const saveCV = useCallback((data: Partial<CVFormInputs>) => {
    const formData = {
      ...data,
      rowsConfig,
      blocks
    };
    
    console.log('Données du formulaire:', formData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  }, [blocks, rowsConfig]);

  const value: CVContextType = {
    blocks,
    rowsConfig,
    isSubmitted,
    addBlock,
    removeBlock,
    updateBlockTitle,
    addNestedBlock,
    removeNestedBlock,
    updateNestedBlockTitle,
    addComponent,
    removeComponent,
    updateComponentProps,
    getBlocksForRow,
    getBlocksForColumnAndRow,
    getRowCount,
    getColumnsForRow,
    setColumnsForRow,
    setRowCount,
    saveCV
  };

  return (
    <CVContext.Provider value={value}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = (): CVContextType => {
  const context = useContext(CVContext);
  
  if (context === undefined) {
    throw new Error('useCV doit être utilisé à l\'intérieur d\'un CVProvider');
  }
  
  return context;
};