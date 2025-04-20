'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BlockInfo, NestedBlockInfo, ComponentInfo, ComponentType, ColumnCount, CVFormInputs } from '@/types/cv';
import { generateId, cloneBlocks } from '@/utils/helpers';

// Définition de l'interface du contexte
interface CVContextType {
  // État
  blocks: BlockInfo[];
  columns: ColumnCount;
  isSubmitted: boolean;
  // Gestion des blocs
  addBlock: (columnIndex: number, title?: string) => void;
  removeBlock: (blockId: string) => void;
  updateBlockTitle: (blockId: string, newTitle: string) => void;
  addNestedBlock: (parentId: string, title?: string) => void;
  removeNestedBlock: (parentId: string, childId: string) => void;
  updateNestedBlockTitle: (parentId: string, childId: string, newTitle: string) => void;
  // Gestion des composants
  addComponent: (blockId: string, componentType: ComponentType) => void;
  removeComponent: (blockId: string, componentId: string) => void;
  updateComponentProps: (blockId: string, componentId: string, newProps: Record<string, string>) => void;
  // Gestion des colonnes
  getBlocksForColumn: (columnIndex: number) => BlockInfo[];
  setColumns: (columns: ColumnCount) => void;
  // Gestion du formulaire
  saveCV: (data: Partial<CVFormInputs>) => void;
}

// Création du contexte avec une valeur par défaut (pour TypeScript)
const CVContext = createContext<CVContextType | undefined>(undefined);

// Props pour le provider
interface CVProviderProps {
  children: ReactNode;
  initialBlocks?: BlockInfo[];
  initialColumns?: ColumnCount;
}

// Provider qui va encapsuler l'application
export const CVProvider: React.FC<CVProviderProps> = ({ 
  children, 
  initialBlocks = [],
  initialColumns = 1
}) => {
  // État
  const [blocks, setBlocks] = useState<BlockInfo[]>(initialBlocks);
  const [columns, setColumns] = useState<ColumnCount>(initialColumns);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  /**
   * Obtenir tous les blocs d'une colonne spécifique
   */
  const getBlocksForColumn = useCallback((columnIndex: number) => {
    return blocks.filter(block => block.columnIndex === columnIndex);
  }, [blocks]);

  /**
   * Ajouter un nouveau bloc à une colonne
   */
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
  
  /**
   * Supprimer un bloc par ID
   */
  const removeBlock = useCallback((blockId: string) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
  }, []);
  
  /**
   * Mettre à jour le titre d'un bloc
   */
  const updateBlockTitle = useCallback((blockId: string, newTitle: string) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === blockId ? { ...block, title: newTitle } : block
      )
    );
  }, []);
  
  /**
   * Ajouter un sous-bloc à un parent
   */
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
  
  /**
   * Supprimer un sous-bloc
   */
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
  
  /**
   * Mettre à jour le titre d'un sous-bloc
   */
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
  
  /**
   * Ajouter un composant à un bloc
   */
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
  
  /**
   * Supprimer un composant d'un bloc
   */
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
  
  /**
   * Mettre à jour les propriétés d'un composant
   */
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

  /**
   * Enregistrer le CV (soumission du formulaire)
   */
  const saveCV = useCallback((data: Partial<CVFormInputs>) => {
    const formData = {
      ...data,
      blocks
    };
    
    console.log('Données du formulaire:', formData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  }, [blocks]);

  // Valeur du contexte
  const value: CVContextType = {
    blocks,
    columns,
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
    getBlocksForColumn,
    setColumns,
    saveCV
  };

  return (
    <CVContext.Provider value={value}>
      {children}
    </CVContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useCV = (): CVContextType => {
  const context = useContext(CVContext);
  
  if (context === undefined) {
    throw new Error('useCV doit être utilisé à l\'intérieur d\'un CVProvider');
  }
  
  return context;
};