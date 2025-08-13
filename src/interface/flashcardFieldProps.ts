export interface FlashcardFieldProps {
  index: number;
  frontText: string;
  backText: string;
  disabled?: boolean;
  onChange: (
    index: number,
    field: 'frontText' | 'backText',
    value: string
  ) => void;
  onRemove?: (index: number) => void;
  canRemove: boolean;
  autoFocus?: boolean;
}