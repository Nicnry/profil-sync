/**
 * Defines the number of columns in the CV layout
 */
export type ColumnCount = 1 | 2 | 3;

/**
 * Enum for component types in the CV
 */
export enum ComponentType {
  BLOCK = 'block',
  INPUT_TITLE = 'input_title',
  INPUT_FROM = 'input_from',
}

/**
 * Information about a component
 */
export interface ComponentInfo {
  id: string;
  type: ComponentType;
  props?: Record<string, string>;
  errors?: Record<string, string>;
}

/**
 * Information about a nested block that can contain other blocks
 */
export interface NestedBlockInfo {
  id: string;
  title: string;
  children: NestedBlockInfo[];
  components?: ComponentInfo[];
}

/**
 * Information about a top-level block that belongs to a column
 */
export interface BlockInfo extends NestedBlockInfo {
  columnIndex: number;
}

/**
 * Form inputs for the CV builder
 */
export interface CVFormInputs {
  columns: ColumnCount;
  blocks?: BlockInfo[];
}

/**
 * Input props for date range component
 */
export interface DateRange {
  from: string;
  to: string;
}

/**
 * Error structure for date range component
 */
export interface DateRangeErrors {
  from?: string;
  to?: string;
}

/**
 * Structure for a CV template
 */
export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  columns: ColumnCount;
  blocks: BlockInfo[];
}
