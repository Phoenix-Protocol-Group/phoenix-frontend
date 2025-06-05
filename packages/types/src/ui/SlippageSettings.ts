export interface SlippageOptionsProps {
  options: number[];
  selectedOption: number;
  onClose: () => void;
  onChange: (option: number) => void;
}
