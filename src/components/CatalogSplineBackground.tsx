import { useEffect, useRef } from "react";

export default function CatalogSplineBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Elegant floating particles and connection lines
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulse: number;
      pulseSpeed: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let frame = 0;
    let running = true;

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      // Deep black base
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Subtle large gradient orbs
      const time = Date.now() * 0.0003;
      const orb1x = width * (0.3 + Math.sin(time * 0.7) * 0.15);
      const orb1y = height * (0.4 + Math.cos(time * 0.5) * 0.2);
      const orb2x = width * (0.7 + Math.cos(time * 0.6) * 0.1);
      const orb2y = height * (0.6 + Math.sin(time * 0.8) * 0.15);

      const g1 = ctx.createRadialGradient(orb1x, orb1y, 0, orb1x, orb1y, Math.max(width, height) * 0.45);
      g1.addColorStop(0, "rgba(20, 20, 25, 0.9)");
      g1.addColorStop(0.5, "rgba(8, 8, 12, 0.5)");
      g1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(orb2x, orb2y, 0, orb2x, orb2y, Math.max(width, height) * 0.4);
      g2.addColorStop(0, "rgba(25, 25, 30, 0.7)");
      g2.addColorStop(0.6, "rgba(10, 10, 14, 0.3)");
      g2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // Fine dot grid
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      const gridSize = 60;
      const offsetX = (time * 5) % gridSize;
      const offsetY = (time * 3) % gridSize;
      for (let x = -gridSize; x < width + gridSize; x += gridSize) {
        for (let y = -gridSize; y < height + gridSize; y += gridSize) {
          const dx = ((x + offsetX) % gridSize) - gridSize / 2;
          const dy = ((y + offsetY) % gridSize) - gridSize / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < gridSize * 0.35) {
            ctx.beginPath();
            ctx.arc(x + offsetX, y + offsetY, 0.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        const glow = 0.5 + Math.sin(p.pulse) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * glow})`;
        ctx.fill();

        // Connection lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Occasional shooting star streaks
      if (Math.random() < 0.01) {
        const sx = Math.random() * width;
        const sy = Math.random() * height * 0.5;
        const len = 80 + Math.random() * 120;
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
        const grad = ctx.createLinearGradient(sx, sy, sx - Math.cos(angle) * len, sy - Math.sin(angle) * len);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.15)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - Math.cos(angle) * len, sy - Math.sin(angle) * len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Soft top/bottom fade for header/footer readability */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/80 to-transparent" />
    </div>
  );
}
