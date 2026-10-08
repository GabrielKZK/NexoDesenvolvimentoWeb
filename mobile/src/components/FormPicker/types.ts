export interface PickerOption {
  label: string;
  value: string;
}

export interface FormPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: PickerOption[];
  placeholder?: string;
}
