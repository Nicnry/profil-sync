export enum ComponentType {
  BLOCK = 'block',
  INPUT_TITLE = 'input_title',
  INPUT_FROM = 'input_from',
}

export interface ComponentInfo {
  id: string;
  type: ComponentType;
  props?: Record<string, string>;
  errors?: Record<string, string>;
}

export interface NestedBlockInfo {
  id: string;
  title: string;
  children: NestedBlockInfo[];
  components?: ComponentInfo[];
}