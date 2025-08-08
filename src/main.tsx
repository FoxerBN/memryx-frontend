import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Initialize theme before React mounts
(() => {
  try {
    const saved = localStorage.getItem("theme");
    const fallback = "light";
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
    } else if (!document.documentElement.getAttribute("data-theme")) {
      document.documentElement.setAttribute("data-theme", fallback);
    }
  } catch (error) {
    console.error("Error initializing theme:", error);
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
