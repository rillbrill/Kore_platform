"use client";

import React, { useEffect, useRef, useState } from "react";

interface OrderFlowFieldCanvasProps {
  lineCount?: number;
  speed?: number;
  amplitude?: number;
  colorMode?: "blue-teal" | "monochrome" | "gold";
}

export function OrderFlowFieldCanvas({
  lineCount = 36,
  speed = 1.0,
  amplitude = 28,
  colorMode = "blue-teal",
}: OrderFlowFieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    let mouse = { x: width / 2, y: height / 2, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    let time = 0;
    let animId: number;
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      time += 0.015 * speed;

      ctx.clearRect(0, 0, width, height);

      const spacing = height / (lineCount + 1);

      for (let i = 0; i < lineCount; i++) {
        const yBase = (i + 1) * spacing;
        ctx.beginPath();

        const step = 6;
        for (let x = 0; x <= width; x += step) {
          // Harmonic wave interference
          const freq1 = 0.005;
          const freq2 = 0.012;
          const phase = time + i * 0.12;

          let yOffset =
            Math.sin(x * freq1 + phase) * amplitude * Math.cos(i * 0.08) +
            Math.cos(x * freq2 - phase * 0.7) * (amplitude * 0.4);

          // Mouse proximity displacement
          if (mouse.active) {
            const dx = x - mouse.x;
            const dy = yBase - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 140;

            if (dist < maxDist) {
              const factor = (1 - dist / maxDist) * 35;
              yOffset += Math.sin(dist * 0.05 - time * 3) * factor;
            }
          }

          const y = yBase + yOffset;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        // Color styling
        const progress = i / lineCount;
        let strokeColor = "";

        if (colorMode === "blue-teal") {
          const r = Math.round(0 + progress * 13);
          const g = Math.round(82 + progress * 100);
          const b = Math.round(255 - progress * 40);
          const a = 0.15 + (1 - Math.abs(progress - 0.5) * 2) * 0.45;
          strokeColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        } else if (colorMode === "gold") {
          const a = 0.15 + (1 - Math.abs(progress - 0.5) * 2) * 0.45;
          strokeColor = `rgba(217, 119, 6, ${a})`;
        } else {
          const a = 0.1 + (1 - Math.abs(progress - 0.5) * 2) * 0.3;
          strokeColor = `rgba(15, 23, 42, ${a})`;
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = i % 4 === 0 ? 1.4 : 0.8;
        ctx.stroke();
      }

      frameCount++;
      if (now - lastFpsUpdate >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = now;
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [lineCount, speed, amplitude, colorMode]);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />

      {/* Telemetry Badge */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-600 flex items-center gap-2 pointer-events-none shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
        <span>Harmonic Waves: <strong className="text-slate-900 font-bold">{fps} FPS</strong></span>
        <span>·</span>
        <span>Lines: <strong className="text-teal-700 font-bold">{lineCount}</strong></span>
      </div>
    </div>
  );
}
