import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TbFolderHeart } from "react-icons/tb";
import FolderNavigation from "@/components/layout/FolderNavigation";
import { motion, AnimatePresence } from "motion/react";
import Notification from "@/components/ui/Notification";
import { useModalOptions } from "@/utils/modalOptionsUtils";
import EditDeleteModal from "@/components/ui/modal/EditDeleteModal";
import {
  containerVariants,
  itemVariants,
  springT,
} from "@/const/folderAnimation";

import { testDecks } from "@/const/testDecksList";
import DeckItem from "@/components/ui/DeckItem";

const mockFolders = [
  { id: 1, name: "English", count: 12 },
  { id: 2, name: "Mathematics", count: 7 },
  { id: 3, name: "Science", count: 9 },
  { id: 4, name: "History", count: 4 },
  { id: 5, name: "Geography", count: 5 },
  { id: 6, name: "Programming", count: 15 },
];
const user = { username: "RiskoMiskoHryzko" };

export default function OneFolder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  const {
    optionsOpen,
    confirmDelete,
    openOptions,
    closeOptions,
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
  } = useModalOptions(navigate);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const numId = id ? parseInt(id, 10) : NaN;
  const folder = mockFolders.find((f) => f.id === numId) || null;

  if (!id) {
    return <Notification type="loading" />;
  }

  if (!folder) {
    return <Notification type="error" message="Folder not found." />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <FolderNavigation
        onBack={() => navigate(-1)}
        onAdd={() => {}}
        username={user?.username ?? "guest"}
      />

      <div className="flex flex-col items-center mb-6">
        <div className="rounded-full p-6 flex items-center justify-center mb-3">
          <TbFolderHeart className="text-5xl" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-1">{folder.name}</h1>
      </div>

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
            : testDecks
                .filter((deck) => deck.folderId === numId)
                .map((deck) => (
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
                      cardCount={deck.cardCount}
                      onClick={() => navigate(`/deck/${deck.id}`)}
                      onOptionsClick={() => openOptions(deck.id)}
                    />
                  </motion.div>
                ))}
        </AnimatePresence>
      </motion.div>

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
