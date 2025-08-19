import React, { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoMdOptions } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import type { FlashcardNavigationProps } from "@/interface/flashcardNavigationProps";

const FlashcardNavigation: React.FC<FlashcardNavigationProps> = ({
  deckName = "set1",
  onBackClick,
  onToggleSettings,
}) => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const onBack = () => {
    if (onBackClick) onBackClick();
    else navigate(-1);
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => {
      const next = !prev;
      onToggleSettings?.(next);
      return next;
    });
  };

  return (
    <div className="flex items-center justify-between w-full pt-3.5 px-4 py-1">
      <button
        className="btn btn-ghost btn-circle"
        onClick={onBack}
        aria-label="Back"
      >
        <IoArrowBackOutline className="text-2xl" />
      </button>

      <div className="text-sm font-medium text-base-content truncate">
        {deckName}
      </div>

      <button
        className="btn btn-ghost btn-circle"
        onClick={toggleSettings}
        aria-label="Settings"
        data-state={isSettingsOpen ? "open" : "closed"}
      >
        <IoMdOptions className="text-2xl" />
      </button>
    </div>
  );
};

export default FlashcardNavigation;
