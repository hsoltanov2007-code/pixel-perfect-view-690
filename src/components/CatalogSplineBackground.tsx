import { useEffect, useRef, useState } from "react";

export default function CatalogSplineBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Mount only on the client for instant, safe hydration.
  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Mouse parallax only — no native zoom/pan/scroll from the Spline iframe.
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
      tx = (e.clientX / window.innerWidth - 0.5) * -22;
      ty = (e.clientY / window.innerHeight - 0.5) * -14;
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
            title="Catalog 3D robot"
            src="https://my.spline.design/x2qorobotcharacterconcept-FEm1F95xUvkmqtB9koPpJwHf/"
            frameBorder="0"
            tabIndex={-1}
            scrolling="no"
            className={`pointer-events-none h-[115%] w-[115%] grayscale transition-opacity duration-150 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ marginLeft: "-7.5%", marginTop: "-7.5%" }}
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>

      {/* Masks the 3D viewer watermark badge */}
      <div className="pointer-events-none absolute right-0 bottom-0 h-28 w-72 bg-[radial-gradient(ellipse_at_bottom_right,var(--background)_55%,transparent_82%)]" />
      {/* Soft vignette to keep the robot centered and readable */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_45%,var(--background)_92%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
    </div>
  );
}
