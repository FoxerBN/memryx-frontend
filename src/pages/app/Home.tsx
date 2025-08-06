import { useState } from "react";
import CreateFolderModal from "@/components/ui/CreateFolderModal";
import ViewSwitcher from "@/components/ui/ViewSwitcher";
import FolderItem from "@/components/ui/FolderItem";
import type { ViewType } from "@/interface/viewSwitch";
import { TbFolderPlus } from "react-icons/tb";
export default function Home() {
  const [view, setView] = useState<ViewType>("grid");
  const [folders, setFolders] = useState([
    { name: "English", count: 12 },
    { name: "Mathematics", count: 7 },
    { name: "Science", count: 9 },
    { name: "History", count: 4 },
    { name: "Geography", count: 5 },
    { name: "Programming", count: 15 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateFolder = (name: string) => {
    setFolders([...folders, { name, count: 0 }]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <ViewSwitcher currentView={view} onViewChange={setView} />
        <TbFolderPlus size={25} onClick={() => setIsModalOpen(true)} />
      </div>

      <div
        className={`${
          view === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 gap-4"
            : "flex flex-col space-y-3"
        }`}
      >
        {folders.map((folder, idx) => (
          <FolderItem key={idx} name={folder.name} view={view} count={folder.count} />
        ))}
      </div>

      <CreateFolderModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateFolder}
      />
    </div>
  );
}
