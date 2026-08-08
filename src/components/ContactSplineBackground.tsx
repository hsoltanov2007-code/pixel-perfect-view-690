import { useEffect, useRef, useState } from "react";

export default function ContactSplineBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Mount only on the client: an SSR-rendered iframe can finish loading before
  // React hydrates, so its onLoad never fires and it stays invisible forever.
  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setLoaded(true), 2500);
    return () => clearTimeout(t);
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
        className="pointer-events-none absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: "translate3d(0,0,0) scale(1.06)" }}
      >
        {mounted && (
          <iframe
            title="Contact 3D background"
            src="https://my.spline.design/astarlikeourown-ot7R5c9QGBeDqKoS8pBSw9B1/"
            frameBorder="0"
            tabIndex={-1}
            scrolling="no"
            className={`pointer-events-none h-[140%] w-[140%] grayscale transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ marginLeft: "-20%", marginTop: "-20%" }}
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>

      {/* Masks the 3D viewer watermark badge */}
      <div className="pointer-events-none absolute right-0 bottom-0 h-36 w-96 bg-[radial-gradient(ellipse_at_bottom_right,var(--background)_58%,transparent_88%)]" />
      {/* Subtle top/bottom fade to keep the form readable without hard side edges */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/30" />
    </div>
  );
}
