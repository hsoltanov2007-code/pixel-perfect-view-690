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
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
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
            className={`pointer-events-none h-[160%] w-[160%] transition-opacity duration-150 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ marginLeft: "-30%", marginTop: "-30%" }}
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>

      {/* Soft top/bottom fade so header and footer stay readable */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background/80 to-transparent" />
    </div>
  );
}
