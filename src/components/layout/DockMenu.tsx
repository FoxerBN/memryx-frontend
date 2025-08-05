import { Link, useLocation } from "react-router-dom";
import { MdHome, MdSettings } from "react-icons/md";

export default function DockMenu() {
  const { pathname } = useLocation();

  return (
    <div className="dock dock-xs">
      <Link to="/home" className={pathname.startsWith("/home") ? "dock-active" : ""}>
        <MdHome className="size-[1.4em]" />
      </Link>

      <Link to="/settings" className={pathname.startsWith("/settings") ? "dock-active" : ""}>
        <MdSettings className="size-[1.4em]" />
      </Link>

      
    </div>
  );
}
