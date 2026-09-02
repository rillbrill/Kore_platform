"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface InteractiveToken3DProps {
  symbol?: string;
  ticker?: string;
  metalColor?: number;
  glassColor?: number;
}

export function InteractiveToken3D({
  symbol = "Ω",
  ticker = "dSEC-200",
  metalColor = 0x0052ff,
  glassColor = 0x0b0f19,
}: InteractiveToken3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.0);
    dirLight1.position.set(4, 6, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0052ff, 2.0);
    dirLight2.position.set(-4, -4, 3);
    scene.add(dirLight2);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Procedural Face Canvas Texture (Dynamic 100% Vector Code)
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Draw Face Graphic
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 512, 512);

    // Subtle Concentric Spirograph Guilloche
    ctx.strokeStyle = "rgba(0, 82, 255, 0.12)";
    ctx.lineWidth = 1;
    for (let r = 30; r < 240; r += 12) {
      ctx.beginPath();
      ctx.arc(256, 256, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Outer Ring
    ctx.strokeStyle = "#0052FF";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.stroke();

    // Technical Markings
    ctx.fillStyle = "#0B0F19";
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("KSD OMNIBUS 1:1 TRUST", 256, 80);
    ctx.fillText(ticker, 256, 430);

    // Central Symbol
    ctx.fillStyle = "#0052FF";
    ctx.font = "bold 140px sans-serif";
    ctx.fillText(symbol, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;

    // 1. Coin Body (Cylinder)
    const coinGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.28, 64);
    
    // Materials: [Side (Rim), Top (Face), Bottom (Back)]
    const rimMat = new THREE.MeshStandardMaterial({
      color: metalColor,
      metalness: 0.85,
      roughness: 0.18,
    });

    const faceMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.2,
      metalness: 0.1,
    });

    const coinMesh = new THREE.Mesh(coinGeo, [rimMat, faceMat, faceMat]);
    coinMesh.rotation.x = Math.PI / 2;
    rootGroup.add(coinMesh);

    // 2. Beveled Metallic Rim Ring
    const torusGeo = new THREE.TorusGeometry(2.02, 0.05, 16, 64);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.1,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    rootGroup.add(torusMesh);

    // Mouse Interaction (Dragging + Hover)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      } else {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
        targetRotationY = x * 0.6;
        targetRotationX = -y * 0.4;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    let animId: number;
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);

      // Inertia lerp
      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.08;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.08;

      if (!isDragging) {
        rootGroup.rotation.y += 0.005;
      }

      renderer.render(scene, camera);

      frameCount++;
      if (time - lastFpsUpdate >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = time;
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      coinGeo.dispose();
      rimMat.dispose();
      faceMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [symbol, ticker, metalColor, glassColor]);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Telemetry Badge */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-600 flex items-center gap-2 pointer-events-none shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        <span>Procedural 3D Token: <strong className="text-slate-900 font-bold">{fps} FPS</strong></span>
        <span>·</span>
        <span>Drag to rotate</span>
      </div>
    </div>
  );
}
