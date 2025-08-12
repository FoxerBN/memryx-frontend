import type { NavigateFunction } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

export function useModalOptions(navigate: NavigateFunction): {
  optionsOpen: boolean;
  setOptionsOpen: Dispatch<SetStateAction<boolean>>;
  confirmDelete: boolean;
  setConfirmDelete: Dispatch<SetStateAction<boolean>>;
  selectedDeckId: number | null;
  setSelectedDeckId: Dispatch<SetStateAction<number | null>>;
  openOptions: (deckId: number) => void;
  closeOptions: () => void;
  handleEdit: () => void;
  handleDeleteClick: () => void;
  handleConfirmDelete: () => void;
} {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);

  const openOptions = (deckId: number) => {
    setSelectedDeckId(deckId);
    setConfirmDelete(false);
    setOptionsOpen(true);
  };

  const closeOptions = () => {
    setOptionsOpen(false);
    setConfirmDelete(false);
    setSelectedDeckId(null);
  };

  const handleEdit = () => {
    if (selectedDeckId != null) {
      navigate(`/deck/${selectedDeckId}/edit`);
    }
    closeOptions();
  };

  const handleDeleteClick = () => {
    setConfirmDelete((prev) => !prev);
  };

  const handleConfirmDelete = () => {
    // TODO: implement delete logic
    closeOptions();
  };

  return {
    optionsOpen,
    setOptionsOpen,
    confirmDelete,
    setConfirmDelete,
    selectedDeckId,
    setSelectedDeckId,
    openOptions,
    closeOptions,
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
