import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

type Props = {
  username?: string;
};

export default function Navigation({ username = "guest" }: Props) {
  return (
    <header className="flex justify-between align-center items-center px-4 py-1">
      <div className="text-sm font-medium text-base-content">{username}</div>
      <ThemeSwitcher />
    </header>
  );
}
