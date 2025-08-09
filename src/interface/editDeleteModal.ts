import type { ReactNode } from "react";

export type EditDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDeleteClick: () => void;
  onConfirmDelete: () => void;
  confirmDelete: boolean;
  title?: string;
  description?: string;
  deleteConfirmText?: string;
  children?: ReactNode;
};