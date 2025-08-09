import { IoArrowBackOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";

type FolderNavigationProps = {
  onBack: () => void;
  onAdd: () => void;
  username?: string;
};

const FolderNavigation = ({ onBack, onAdd, username = "guest" }: FolderNavigationProps) => (
  <div className="flex items-center justify-between w-full pt-3.5  px-4 py-1">
    <button
      className="btn btn-ghost btn-circle"
      onClick={onBack}
      aria-label="Back"
    >
      <IoArrowBackOutline className="text-2xl" />
    </button>
    <div className="text-sm font-medium text-base-content">{username}</div>
    <button
      className="btn btn-ghost btn-circle"
      onClick={onAdd}
      aria-label="Add"
    >
      <FaPlus className="text-lg" />
    </button>
  </div>
);

export default FolderNavigation;
