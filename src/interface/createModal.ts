export interface CreateFolderModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}