// src/layouts/AuthLayout.tsx
import { Outlet } from "react-router-dom";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
// ↓ keď si footer dopíšeš, stačí ho importovať:
import Footer from "@/components/layout/Footer";

export default function AuthLayout() {
  return (
    <div className="min-h-[100dvh] overflow-x-hidden flex flex-col">
      <header className="flex justify-end p-4">
        <ThemeSwitcher />
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
