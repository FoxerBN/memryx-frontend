import notfound from "@/assets/background/notfound.png";
import notfoundSound from "@/assets/sounds/notfound.mp3";
import { useRef, useState } from "react";

export default function NotFoundPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [played, setPlayed] = useState(false);

  const handleClick = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(notfoundSound);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    setPlayed(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center cursor-pointer select-none"
      style={{
        backgroundImage: `url(${notfound})`,
        backgroundSize: "100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
      onClick={played ? undefined : handleClick}
      tabIndex={0}
      role="button"
      aria-label="Play 404 sound"
    >
    </div>
  );
}
