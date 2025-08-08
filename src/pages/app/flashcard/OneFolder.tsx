import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TbFolderHeart } from "react-icons/tb";
import { PiCardsThree } from "react-icons/pi";
import { SlOptionsVertical } from "react-icons/sl";
import { IoArrowBackOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "motion/react";
import {
  containerVariants,
  itemVariants,
  springT,
} from "@/const/folderAnimation";
import { base, list as listCard } from "@/const/folderView";
import { testDecks } from "@/const/testDecksList";

const mockFolders = [
  { id: 1, name: "English", count: 12 },
  { id: 2, name: "Mathematics", count: 7 },
  { id: 3, name: "Science", count: 9 },
  { id: 4, name: "History", count: 4 },
  { id: 5, name: "Geography", count: 5 },
  { id: 6, name: "Programming", count: 15 },
];

export default function OneFolder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const numId = id ? parseInt(id, 10) : NaN;
  const folder = mockFolders.find((f) => f.id === numId) || null;

  if (!id) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center text-lg">Loading...</div>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center text-lg text-error">Folder not found.</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <button
        className="btn btn-ghost btn-circle mb-4"
        onClick={() => navigate(-1)}
        aria-label="Back"
      >
        <IoArrowBackOutline className="text-2xl" />
      </button>

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
                    <div className={`${base} ${listCard}`}>
                      <div className="flex flex-col items-center justify-center w-12 shrink-0 ml-2">
                        <div className="text-xs font-semibold">
                          {deck.cardCount}
                        </div>
                        <PiCardsThree className="mt-1 rotate-90" size={22} />
                      </div>
                      <div className="card-body p-3">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {deck.name}
                            </div>
                            <div className="text-xs text-base-content/60">
                              {deck.description}
                            </div>
                          </div>
                          <button
                            className="btn btn-ghost btn-xs"
                            aria-label="Deck options"
                          >
                            <SlOptionsVertical />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
