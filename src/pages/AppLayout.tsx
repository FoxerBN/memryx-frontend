import { Outlet } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import DockMenu from "@/components/layout/DockMenu";

export default function AppLayout() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navigation />

      <main className="flex-1 flex justify-center px-4">
        <Outlet />
      </main>

      <DockMenu />
    </div>
  );
}
