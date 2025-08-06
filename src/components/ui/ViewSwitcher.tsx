import { BsGrid, BsListUl } from "react-icons/bs";
import type { ViewSwitcherProps } from "@/interface/viewSwitch";

const ViewSwitcher = ({ currentView, onViewChange }: ViewSwitcherProps) => {
  return (
    <div className="flex items-center gap-2 p-1 rounded-md">
      <button
        className={`p-1.5 rounded ${currentView === "grid" ? "border shadow-sm" : ""}`}
        onClick={() => onViewChange("grid")}
        aria-label="Grid view"
      >
        <BsGrid size={18} />
      </button>
      <button
        className={`p-1.5 rounded ${currentView === "list" ? "border shadow-sm" : ""}`}
        onClick={() => onViewChange("list")}
        aria-label="List view"
      >
        <BsListUl size={18} />
      </button>
    </div>
  );
};

export default ViewSwitcher;
