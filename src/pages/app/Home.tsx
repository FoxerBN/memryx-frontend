import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "motion/react";
import CreateFolderModal from "@/components/ui/CreateFolderModal";
import ViewSwitcher from "@/components/ui/ViewSwitcher";
import FolderItem from "@/components/ui/FolderItem";
import type { ViewType } from "@/interface/viewSwitch";
import { TbFolderPlus } from "react-icons/tb";
import { containerVariants,springT, itemVariants } from "@/const/folderAnimation";


export default function Home() {
  const [view, setView] = useState<ViewType>("grid");
  const [loading, setLoading] = useState(true); // Make loading stateful
  const [folders, setFolders] = useState([
    { id: 1, name: "English", count: 12 },
    { id: 2, name: "Mathematics", count: 7 },
    { id: 3, name: "Science", count: 9 },
    { id: 4, name: "History", count: 4 },
    { id: 5, name: "Geography", count: 5 },
    { id: 6, name: "Programming", count: 15 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateFolder = (name: string) => {
    setFolders((prev) => [...prev, { id: Date.now(), name, count: 0 }]);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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

      {/* Folder list */}
      <motion.div
        layout
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ layout: springT }} // smoother view switch
        className={
          view === "grid"
            ? "grid grid-cols-2 pb-20 md:grid-cols-3 gap-4"
            : "flex flex-col pb-20 space-y-3"
        }
      >
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="skeleton h-20 w-auto" />
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
                <FolderItem
                  name={folder.name}
                  count={folder.count}
                  view={view}
                />
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
