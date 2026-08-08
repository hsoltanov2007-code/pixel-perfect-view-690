import { useEffect, useState } from "react";

export default function SplineBackground() {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Defer the heavy 3D iframe until the browser is idle so the first paint
    // and hydration of the page stay smooth on every reload.
    let cancelled = false;
    const start = () => {
      if (!cancelled) setMounted(true);
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(start, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(start, 300);
    }
    return () => {
      cancelled = true;
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="pointer-events-auto absolute inset-0">
        {mounted && (
          <iframe
            title="3D robot"
            src="https://my.spline.design/nexbotbyaximoriscopycopy-yfZ7bdWYajBxb40GbmUnVyOq/"
            frameBorder="0"
            className={`h-full w-full transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>
      {/* Masks the 3D viewer watermark badge */}
      <div className="pointer-events-none absolute right-0 bottom-0 h-28 w-72 bg-[radial-gradient(ellipse_at_bottom_right,var(--background)_55%,transparent_82%)]" />
      {/* Soft vignette that keeps the robot visible in the center */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_45%,var(--background)_92%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
      <div className="glow-orb pointer-events-none absolute top-1/4 left-[6%] h-64 w-64 rounded-full bg-foreground/8 blur-[110px]" />
      <div className="glow-orb pointer-events-none absolute right-[8%] bottom-1/4 h-80 w-80 rounded-full bg-foreground/8 blur-[130px]" />
    </div>
  );
}
