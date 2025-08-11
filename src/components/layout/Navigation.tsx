import ThemeSwitcher from "@/components/ui/switcher/ThemeSwitcher";
import { getUser } from "@/utils/authStorage";

type DisplayNameProps = {
  username?: string;
};

export default function Navigation({ username = "guest" }: DisplayNameProps) {
  const storedUser = getUser();
  if (storedUser) {
    username = storedUser.displayName;
  }
  return (
    <header className="flex justify-between align-center items-center px-4 py-1">
      <div className="text-sm font-medium text-base-content">{username}</div>
      <ThemeSwitcher />
    </header>
  );
}
