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

    // Soft luminous floating particles for white theme
    const particlesCount = 35;
    const particles = Array.from({ length: particlesCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.1,
      color:
        Math.random() > 0.5
          ? "rgba(168, 85, 247, "
          : Math.random() > 0.5
          ? "rgba(244, 63, 94, "
          : "rgba(14, 165, 233, ",
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
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Clean white canvas base
      ctx.fillStyle = "#fafafc";
      ctx.fillRect(0, 0, width, height);

      // Ambient pearlescent pastel gradients
      const glow1X = width * 0.2 + Math.sin(time) * 100;
      const glow1Y = height * 0.25 + Math.cos(time * 0.7) * 70;
      const grad1 = ctx.createRadialGradient(glow1X, glow1Y, 0, glow1X, glow1Y, 550);
      grad1.addColorStop(0, "rgba(244, 63, 94, 0.07)");
      grad1.addColorStop(0.5, "rgba(236, 72, 153, 0.03)");
      grad1.addColorStop(1, "rgba(250, 250, 252, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const glow2X = width * 0.8 + Math.cos(time * 0.8) * 80;
      const glow2Y = height * 0.5 + Math.sin(time * 0.9) * 80;
      const grad2 = ctx.createRadialGradient(glow2X, glow2Y, 0, glow2X, glow2Y, 600);
      grad2.addColorStop(0, "rgba(147, 51, 234, 0.06)");
      grad2.addColorStop(0.5, "rgba(168, 85, 247, 0.02)");
      grad2.addColorStop(1, "rgba(250, 250, 252, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      const glow3X = width * 0.5 + Math.sin(time * 0.6) * 60;
      const glow3Y = height * 0.85 + Math.cos(time * 0.5) * 50;
      const grad3 = ctx.createRadialGradient(glow3X, glow3Y, 0, glow3X, glow3Y, 500);
      grad3.addColorStop(0, "rgba(14, 165, 233, 0.05)");
      grad3.addColorStop(1, "rgba(250, 250, 252, 0)");
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // Mouse subtle follow spotlight
      const mouseGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 280);
      mouseGrad.addColorStop(0, "rgba(168, 85, 247, 0.04)");
      mouseGrad.addColorStop(1, "transparent");
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle particles
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
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
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
}
