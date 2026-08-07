import { useEffect, useRef } from "react";
import introAsset from "@/assets/intro.mp4.asset.json";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 1.3;
    v.play().catch(() => finish());
    // safety net in case the video never fires "ended"
    const fallback = setTimeout(finish, 12000);
    return () => clearTimeout(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="preloader fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background">
      <video
        ref={videoRef}
        src={introAsset.url}
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={finish}
        onError={finish}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
