// pages/Home.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { TbFolderPlus } from "react-icons/tb";

import CreateFolderModal from "@/components/ui/modal/CreateFolderModal";
import FolderEditModal from "@/components/ui/modal/FolderEditModal"; // uprav cestu, ak sa líši
import ViewSwitcher from "@/components/ui/switcher/ViewSwitcher";
import FolderItem from "@/components/ui/FolderItem";
import Notification from "@/components/ui/Notification";

import type { ViewType } from "@/interface/viewSwitch";
import type { FolderSummary } from "@/type/folderApi";
import { containerVariants, springT, itemVariants } from "@/const/folderAnimation";
import { useFolder } from "@/hooks/useFolder";

export default function Home() {
  const [view, setView] = useState<ViewType>("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { folders, loading, error, create, rename, remove } = useFolder();

  // Options modal (Edit/Delete)
  const [optsOpen, setOptsOpen] = useState(false);
  const [selected, setSelected] = useState<FolderSummary | null>(null);

  const openOptions = (folder: FolderSummary) => {
    setSelected(folder);
    setOptsOpen(true);
  };
  const closeOptions = () => {
    setOptsOpen(false);
    setSelected(null);
  };

  const handleCreateFolder = async (name: string) => {
    await create(name);
    setIsCreateOpen(false);
  };

  const isEmpty = !loading && folders.length === 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <ViewSwitcher currentView={view} onViewChange={setView} />
        <TbFolderPlus
          size={25}
          className="cursor-pointer"
          onClick={() => setIsCreateOpen(true)}
          title="Create folder"
          aria-label="Create folder"
        />
      </div>

      {/* Error (neblokuje UI) */}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center gap-4 py-14">
          <Notification type="info" message="You have no folders yet." />
          <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
            Create your first folder
          </button>
        </div>
      )}

      {/* Zoznam / Loading */}
      {!isEmpty && (
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ layout: springT }}
          className={
            view === "grid"
              ? "grid grid-cols-2 pb-20 md:grid-cols-3 gap-4"
              : "flex flex-col pb-20 space-y-3"
          }
        >
          <AnimatePresence mode="popLayout">
            {loading && folders.length === 0
              ? Array.from({ length: 10 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`skeleton w-auto ${view === "grid" ? "h-27" : "h-15"}`}
                  />
                ))
              : folders.map((folder) => (
                  <motion.div
                    key={folder.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ scale: 1.035 }}
                    transition={{ layout: springT }}
                  >
                    <Link to={`/folder/${folder.id}`}>
                      <FolderItem
                        name={folder.name}
                        count={folder.deckCount}
                        view={view}
                        onOptionsClick={() => openOptions(folder)} // tri bodky sú priamo v FolderItem
                      />
                    </Link>
                  </motion.div>
                ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Create modal */}
      <CreateFolderModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateFolder}
      />

      {/* Options modal (Edit/Delete) */}
      <FolderEditModal
        open={optsOpen}
        onClose={closeOptions}
        folderId={selected?.id ?? 0}
        initialName={selected?.name ?? ""}
        onRename={(id, name) => rename(id, name)}
        onDelete={(id) => remove(id)}
      />
    </div>
  );
}
