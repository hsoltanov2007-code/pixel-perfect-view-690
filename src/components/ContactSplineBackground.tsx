import { useEffect, useRef, useState } from "react";

export default function ContactSplineBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let frame = 0;
    let tx = 0;
    let ty = 0;
    const apply = () => {
      frame = 0;
      layer.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.06)`;
    };
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * -18;
      ty = (e.clientY / window.innerHeight - 0.5) * -12;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
    };
  }, [mounted]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div
        ref={layerRef}
        className="pointer-events-auto absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: "translate3d(0,0,0) scale(1.06)" }}
      >
        {mounted && (
          <iframe
            title="Contact 3D background"
            src="https://my.spline.design/astarlikeourown-ot7R5c9QGBeDqKoS8pBSw9B1/"
            frameBorder="0"
            className={`pointer-events-auto h-[112%] w-[112%] transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ marginLeft: "-6%", marginTop: "-6%" }}
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>

      {/* Masks the 3D viewer watermark badge */}
      <div className="pointer-events-none absolute right-0 bottom-0 h-36 w-96 bg-[radial-gradient(ellipse_at_bottom_right,var(--background)_58%,transparent_88%)]" />
      {/* Soft vignette to keep the form readable */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_55%,var(--background)_95%)]" />
      <div className="pointer-events-none absolute inset-0 bg-background/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />
    </div>
  );
}
