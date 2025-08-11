export type FolderEditModalProps = {
  open: boolean;
  onClose: () => void;
  folderId: number;
  initialName: string;
  onRename: (id: number, name: string) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
};

export type Mode = "menu" | "edit" | "confirm";