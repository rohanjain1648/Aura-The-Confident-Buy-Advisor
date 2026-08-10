"use client";

import { useEffect, useRef } from "react";

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle nodes
    const particlesCount = 45;
    const particles = Array.from({ length: particlesCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
      color:
        Math.random() > 0.5
          ? "rgba(168, 85, 247, "
          : Math.random() > 0.5
          ? "rgba(244, 63, 94, "
          : "rgba(6, 182, 212, ",
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let time = 0;

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Deep obsidian base
      ctx.fillStyle = "#05050a";
      ctx.fillRect(0, 0, width, height);

      // Ambient radial lights pulsing
      const glow1X = width * 0.25 + Math.sin(time) * 120;
      const glow1Y = height * 0.3 + Math.cos(time * 0.8) * 80;
      const grad1 = ctx.createRadialGradient(glow1X, glow1Y, 0, glow1X, glow1Y, 450);
      grad1.addColorStop(0, "rgba(168, 85, 247, 0.18)");
      grad1.addColorStop(0.5, "rgba(126, 34, 206, 0.06)");
      grad1.addColorStop(1, "rgba(5, 5, 10, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const glow2X = width * 0.75 + Math.cos(time * 0.9) * 100;
      const glow2Y = height * 0.6 + Math.sin(time * 1.1) * 90;
      const grad2 = ctx.createRadialGradient(glow2X, glow2Y, 0, glow2X, glow2Y, 500);
      grad2.addColorStop(0, "rgba(244, 63, 94, 0.15)");
      grad2.addColorStop(0.5, "rgba(225, 29, 72, 0.05)");
      grad2.addColorStop(1, "rgba(5, 5, 10, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      const glow3X = width * 0.5 + Math.sin(time * 0.7) * 80;
      const glow3Y = height * 0.8 + Math.sin(time * 0.5) * 60;
      const grad3 = ctx.createRadialGradient(glow3X, glow3Y, 0, glow3X, glow3Y, 400);
      grad3.addColorStop(0, "rgba(6, 182, 212, 0.12)");
      grad3.addColorStop(1, "rgba(5, 5, 10, 0)");
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // Mouse subtle follow spotlight
      const mouseGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 300);
      mouseGrad.addColorStop(0, "rgba(168, 85, 247, 0.08)");
      mouseGrad.addColorStop(1, "transparent");
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw particle network
      particles.forEach((p, idx) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fill();

        // Connect nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.08 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
}
