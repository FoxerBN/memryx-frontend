// pages/Home.tsx (zmenené časti)
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import CreateFolderModal from "@/components/ui/modal/CreateFolderModal";
import ViewSwitcher from "@/components/ui/switcher/ViewSwitcher";
import FolderItem from "@/components/ui/FolderItem";
import type { ViewType } from "@/interface/viewSwitch";
import { TbFolderPlus } from "react-icons/tb";
import { containerVariants, springT, itemVariants } from "@/const/folderAnimation";
import { useFolder } from "@/hooks/useFolder";
import Notification from "@/components/ui/Notification";

export default function Home() {
  const [view, setView] = useState<ViewType>("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { folders, loading, error, create } = useFolder();

  const handleCreateFolder = async (name: string) => {
    await create(name);
  };

  if(folders.length == 0)return  <Notification type="info" message="You have no folders yet."/>

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <ViewSwitcher currentView={view} onViewChange={setView} />
        <TbFolderPlus
          size={25}
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* Voliteľne error */}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Folder list */}
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
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className={`skeleton w-auto ${view === "grid" ? "h-27" : "h-15"}`}
              />
            ))
          ) : (
            folders.map((folder) => (
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
                  />
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modal */}
      <CreateFolderModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateFolder}
      />
    </div>
  );
}
