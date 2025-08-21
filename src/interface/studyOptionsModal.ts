export type StudyOrder = "original" | "reverse" | "random";

export interface StudyOptionsModalProps {
  open: boolean;
  current: StudyOrder;
  onClose: () => void;
  onSelect: (mode: StudyOrder) => void;
}
