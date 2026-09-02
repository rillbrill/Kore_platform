"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface WireframeVaultWebGLProps {
  gridDensity?: number;
  scanSpeed?: number;
  colorScheme?: "blue" | "emerald" | "monochrome";
}

export function WireframeVaultWebGL({
  gridDensity = 16,
  scanSpeed = 1.5,
  colorScheme = "blue",
}: WireframeVaultWebGLProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const themeColors = {
      blue: { primary: 0x0052ff, secondary: 0x00f59b, scan: 0x2563eb },
      emerald: { primary: 0x059669, secondary: 0x10b981, scan: 0x047857 },
      monochrome: { primary: 0x0b0f19, secondary: 0x64748b, scan: 0x334155 },
    }[colorScheme];

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Dodecahedron Outer Security Sphere Cage
    const geo = new THREE.DodecahedronGeometry(2.0, 1);
    const wireframeGeo = new THREE.WireframeGeometry(geo);
    const lineMat = new THREE.LineBasicMaterial({
      color: themeColors.primary,
      transparent: true,
      opacity: 0.5,
    });
    const cage = new THREE.LineSegments(wireframeGeo, lineMat);
    rootGroup.add(cage);

    // 2. Vertex Coordinate Nodes
    const posAttr = geo.attributes.position;
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", posAttr);

    const pointMat = new THREE.PointsMaterial({
      color: themeColors.secondary,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
    });
    const pointCloud = new THREE.Points(pointGeo, pointMat);
    rootGroup.add(pointCloud);

    // 3. Inner Solid Translucent Core
    const innerGeo = new THREE.IcosahedronGeometry(1.0, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: themeColors.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerMesh);

    // 4. Sweeping Laser Scanner Plane
    const scanPlaneGeo = new THREE.RingGeometry(0.1, 2.5, 64);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: themeColors.scan,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const scanPlane = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanPlane.rotation.x = Math.PI / 2;
    rootGroup.add(scanPlane);

    // 5. Ambient Bottom Grid Floor
    const gridHelper = new THREE.GridHelper(8, gridDensity, themeColors.primary, 0xe2e8f0);
    gridHelper.position.y = -2.4;
    scene.add(gridHelper);

    // Mouse Interaction
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = x * 0.7;
      targetRotX = y * 0.4;
    };

    container.addEventListener("mousemove", handleMouseMove);

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

      const t = time * 0.001;

      // Inertia rotation
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.05 + 0.004;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.05;

      // Laser plane scan motion
      scanPlane.position.y = Math.sin(t * scanSpeed) * 1.8;
      scanPlane.rotation.z += 0.01;

      innerMesh.rotation.y -= 0.01;
      innerMesh.rotation.x += 0.005;

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
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geo.dispose();
      wireframeGeo.dispose();
      lineMat.dispose();
      pointGeo.dispose();
      pointMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      scanPlaneGeo.dispose();
      scanPlaneMat.dispose();
      gridHelper.dispose();
      renderer.dispose();
    };
  }, [gridDensity, scanSpeed, colorScheme]);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full cursor-crosshair" />

      {/* Telemetry Badge */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-600 flex items-center gap-2 pointer-events-none shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span>Vector Wireframe: <strong className="text-slate-900 font-bold">{fps} FPS</strong></span>
        <span>·</span>
        <span>Vertices: <strong className="text-blue-700 font-bold">120</strong></span>
      </div>
    </div>
  );
}
