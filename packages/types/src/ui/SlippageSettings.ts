export interface SlippageOptionsProps {
  options: string[];
  selectedOption: number;
  onClose: () => void;
  onChange: (option: string) => void;
}
