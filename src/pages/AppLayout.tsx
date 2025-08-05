import { Outlet } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import DockMenu from "@/components/layout/DockMenu";

export default function AppLayout() {
  return (
    <div className="min-h-[100dvh] flex flex-col overflow-x-hidden">
      <Navigation />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Outlet />
      </main>

      <DockMenu />
    </div>
  );
}
