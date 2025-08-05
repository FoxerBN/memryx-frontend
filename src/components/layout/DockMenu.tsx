import { Link, useLocation } from "react-router-dom";
import { RiHomeHeartLine } from "react-icons/ri";
import { LuSettings } from "react-icons/lu";

export default function DockMenu() {
  const { pathname } = useLocation();

  return (
    <div className="dock dock-xs">
      <Link to="/home" className={pathname.startsWith("/home") ? "dock-active" : ""}>
        <RiHomeHeartLine className="size-[1.4em]" />
      </Link>

      <Link to="/settings" className={pathname.startsWith("/settings") ? "dock-active" : ""}>
        <LuSettings className="size-[1.4em]" />
      </Link>

      
    </div>
  );
}
