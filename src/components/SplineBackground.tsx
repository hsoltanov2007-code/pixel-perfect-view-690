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
      <div className="pointer-events-none absolute right-0 bottom-0 h-28 w-72 bg-[radial-gradient(ellipse_at_bottom_right,var(--background)_45%,transparent_80%)] backdrop-blur-md" />
      {/* Soft vignette that keeps the robot visible in the center */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_45%,var(--background)_92%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
      <div className="glow-orb pointer-events-none absolute top-1/4 left-[6%] h-64 w-64 rounded-full bg-foreground/8 blur-[110px]" />
      <div className="glow-orb pointer-events-none absolute right-[8%] bottom-1/4 h-80 w-80 rounded-full bg-foreground/8 blur-[130px]" />
    </div>
  );
}
