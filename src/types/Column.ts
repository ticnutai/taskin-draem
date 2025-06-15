export interface Column {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  required?: boolean;
}