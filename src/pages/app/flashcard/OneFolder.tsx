// pages/OneFolder.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AxiosResponse } from "axios";
import { TbFolderHeart } from "react-icons/tb";
import FolderNavigation from "@/components/layout/FolderNavigation";
import { motion, AnimatePresence } from "motion/react";
import Notification from "@/components/ui/Notification";
import EditDeleteModal from "@/components/ui/modal/EditDeleteModal";
import { useModalOptions } from "@/utils/modalOptionsUtils";
import { containerVariants, itemVariants, springT } from "@/const/folderAnimation";
import DeckItem from "@/components/ui/DeckItem";
import { useDecks } from "@/hooks/useDeck";
import { getFolder } from "@/utils/api";
import type { DeckSummary } from "@/type/deckApi";
import type { FolderDto } from "@/type/folderApi";
import { getUser as getStoredUser } from "@/utils/authStorage";
import { loadFolders } from "@/utils/folderStorage";

export default function OneFolder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const folderId = id ? Number(id) : NaN;

  // 1) predvyplň názov z cache (ak existuje)
  const userId = getStoredUser()?.userId ?? null;
  const displayName = getStoredUser()?.displayName ?? "User";
  const cachedName =
    userId != null
      ? loadFolders(userId)?.folders.find((f) => f.id === folderId)?.name ?? ""
      : "";

  const [folderName, setFolderName] = useState<string>(cachedName);

  const { decks, loading, error, remove } = useDecks(Number.isNaN(folderId) ? null : folderId);

  useEffect(() => {
    if (Number.isNaN(folderId)) return;
    getFolder(folderId)
      .then((r: AxiosResponse<FolderDto>) => setFolderName(r.data?.name ?? cachedName))
      .catch(() => {
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, userId]);

  const {
    optionsOpen,
    confirmDelete,
    selectedDeckId,
    openOptions,
    closeOptions,
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete: originalHandleConfirmDelete,
  } = useModalOptions(navigate);

  const handleConfirmDelete = async () => {
    if (selectedDeckId != null) {
      await remove(selectedDeckId);
    }
    originalHandleConfirmDelete();
  };

  if (!id || Number.isNaN(folderId)) {
    return <Notification type="error" message="Invalid folder id." />;
  }

  const isEmpty = !loading && !error && decks.length === 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <FolderNavigation
        onBack={() => navigate("/home")}
        onAdd={() => navigate(`/folder/${folderId}/create-deck`)}
        username={displayName}
      />

      <div className="flex flex-col items-center mb-6">
        <div className="rounded-full p-6 flex items-center justify-center mb-3">
          <TbFolderHeart className="text-5xl" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-1">
          {folderName || `Folder #${folderId}`}
        </h1>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {isEmpty && (
        <div className="flex flex-col items-center gap-4 py-14">
          <Notification type="info" message="This folder has no decks yet." />
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/folder/${folderId}/create-deck`)}>
            Create your first deck
          </button>
        </div>
      )}

      {!isEmpty && (
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ layout: springT }}
          className="flex flex-col pb-20 space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="skeleton h-20 w-auto" />
                ))
              : decks.map((deck: DeckSummary) => (
                  <motion.div
                    key={deck.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ scale: 1.035 }}
                    transition={{ layout: springT }}
                  >
                    <DeckItem
                      name={deck.name}
                      description={deck.description}
                      cardCount={deck.flashcardCount}
                      onClick={() => navigate(`/deck/${deck.id}`)}
                      onOptionsClick={() => openOptions(deck.id)}
                    />
                  </motion.div>
                ))}
          </AnimatePresence>
        </motion.div>
      )}

      <EditDeleteModal
        open={optionsOpen}
        onClose={closeOptions}
        onEdit={handleEdit}
        onDeleteClick={handleDeleteClick}
        onConfirmDelete={handleConfirmDelete}
        confirmDelete={confirmDelete}
      />
    </div>
  );
}
