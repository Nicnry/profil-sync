/**
 * Defines the number of columns in the CV layout
 */
export type ColumnCount = 1 | 2 | 3;

/**
 * Defines the number of rows in the CV layout
 */
export type RowCount = 1 | 2 | 3;

export interface RowConfig {
  rowIndex: number;
  columns: ColumnCount;
  label: string;
}

/**
 * Enum for component types in the CV
 */
export enum ComponentType {
  BLOCK = 'block',
  INPUT_TITLE = 'input_title',
  INPUT_FROM = 'input_from',
  INPUT_TEXT = 'input_text',
  TEXTAREA = 'textarea',
  RICH_TEXT = 'rich_text',
  BULLET_LIST = 'bullet_list',
  CONTACT_INFO = 'contact_info',
  SKILLS = 'skills',
  LANGUAGES = 'languages',
  IMAGE = 'image',
  LINKS = 'links',
  REFERENCES = 'references',
}

/**
 * Information about a component
 */
export interface ComponentInfo {
  id: string;
  type: ComponentType;
  props?: Record<string, string | number | boolean | null | undefined>;
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
  rowIndex: number;
}

/**
 * Form inputs for the CV builder
 */
export interface CVFormInputs {
  rowCount: RowCount;
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

/**
 * Niveau de compétence
 */
export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

/**
 * Interface pour un élément de compétence
 */
export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

/**
 * Interface pour une langue
 */
export interface Language {
  id: string;
  name: string;
  level: SkillLevel;
}

/**
 * Interface pour un élément de liste à puces
 */
export interface BulletItem {
  id: string;
  text: string;
}

/**
 * Interface pour un lien social/professionnel
 */
export interface Link {
  id: string;
  platform: string;
  url: string;
  label?: string;
}

/**
 * Interface pour une référence professionnelle
 */
export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  contact: string;
}

/**
 * Interface pour les informations de contact
 */
export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}