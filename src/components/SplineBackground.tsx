import { useEffect, useState } from "react";

export default function SplineBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="pointer-events-auto absolute inset-0">
        {mounted && (
          <iframe
            title="3D robot"
            src="https://my.spline.design/nexbotbyaximoriscopycopy-yfZ7bdWYajBxb40GbmUnVyOq/"
            frameBorder="0"
            className="h-full w-full"
            loading="lazy"
          />
        )}
      </div>
      {/* Masks the 3D viewer watermark badge */}
      <div className="pointer-events-none absolute right-0 bottom-0 h-24 w-64 bg-[radial-gradient(ellipse_at_bottom_right,var(--background)_35%,transparent_75%)] backdrop-blur-md" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/25 to-background/55" />
      <div className="glow-orb pointer-events-none absolute top-24 left-[8%] h-56 w-56 rounded-full bg-foreground/10 blur-[90px]" />
      <div className="glow-orb pointer-events-none absolute right-[12%] bottom-24 h-72 w-72 rounded-full bg-foreground/10 blur-[110px]" />
    </div>
  );
}
