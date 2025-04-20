import { BlockInfo, NestedBlockInfo } from '@/types/cv';

/**
 * Generates a unique ID with optional prefix
 * 
 * @param prefix Optional prefix for the ID
 * @returns A unique string ID
 */
export const generateId = (prefix: string = 'item'): string => 
  `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

/**
 * Deep counts all blocks including nested blocks
 * 
 * @param blocks Array of top-level blocks
 * @returns Total count of blocks and nested blocks
 */
export const countAllBlocks = (blocks: BlockInfo[]): number => {
  let count = blocks.length;
  
  blocks.forEach(block => {
    count += countNestedBlocks(block.children);
  });
  
  return count;
};

/**
 * Recursively counts nested blocks
 * 
 * @param children Array of nested blocks
 * @returns Count of all nested blocks
 */
export const countNestedBlocks = (children: NestedBlockInfo[]): number => {
  if (!children || children.length === 0) return 0;
  
  let count = children.length;
  
  children.forEach(child => {
    if (child.children && child.children.length > 0) {
      count += countNestedBlocks(child.children);
    }
  });
  
  return count;
};

/**
 * Counts all components within blocks and their nested blocks
 * 
 * @param blocks Array of top-level blocks
 * @returns Total number of components
 */
export const countAllComponents = (blocks: BlockInfo[]): number => {
  let count = 0;
  
  blocks.forEach(block => {
    count += block.components ? block.components.length : 0;
    count += countNestedComponents(block.children);
  });
  
  return count;
};

/**
 * Recursively counts components in nested blocks
 * 
 * @param children Array of nested blocks
 * @returns Count of components in all nested blocks
 */
export const countNestedComponents = (children: NestedBlockInfo[]): number => {
  if (!children || children.length === 0) return 0;
  
  let count = 0;
  
  children.forEach(child => {
    count += child.components ? child.components.length : 0;
    
    if (child.children && child.children.length > 0) {
      count += countNestedComponents(child.children);
    }
  });
  
  return count;
};

/**
 * Finds a block by ID in the nested structure
 * 
 * @param blocks Array of blocks to search in
 * @param blockId ID of the block to find
 * @returns The found block or undefined
 */
export const findBlockById = (
  blocks: BlockInfo[] | NestedBlockInfo[], 
  blockId: string
): BlockInfo | NestedBlockInfo | undefined => {
  for (const block of blocks) {
    if (block.id === blockId) {
      return block;
    }
    
    if (block.children && block.children.length > 0) {
      const foundInChildren = findBlockById(block.children, blockId);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
  
  return undefined;
};

/**
 * Finds the parent block of a given block ID
 * 
 * @param blocks Array of blocks to search in
 * @param childId ID of the child block to find the parent for
 * @returns The parent block or undefined
 */
export const findParentBlock = (
  blocks: BlockInfo[] | NestedBlockInfo[],
  childId: string
): BlockInfo | NestedBlockInfo | undefined => {
  for (const block of blocks) {
    if (block.children && block.children.some(child => child.id === childId)) {
      return block;
    }
    
    if (block.children && block.children.length > 0) {
      const foundInChildren = findParentBlock(block.children, childId);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
  
  return undefined;
};

/**
 * Creates a deep copy of blocks
 * 
 * @param blocks Array of blocks to clone
 * @returns Deep copy of blocks
 */
export const cloneBlocks = <T extends BlockInfo[] | NestedBlockInfo[]>(blocks: T): T => {
  return JSON.parse(JSON.stringify(blocks));
};

/**
 * Formats a block for display in debugging UI
 * 
 * @param block Block to format
 * @param depth Current nesting depth
 * @returns Formatted display string
 */
export const formatBlockForDisplay = (
  block: BlockInfo | NestedBlockInfo, 
  depth: number = 0
): string => {
  const indent = '  '.repeat(depth);
  const title = block.title || 'Sans titre';
  const componentCount = block.components?.length || 0;
  
  let display = `${indent}• ${title}`;
  
  if (componentCount > 0) {
    display += ` (${componentCount} champ${componentCount > 1 ? 's' : ''})`;
  }
  
  return display;
};