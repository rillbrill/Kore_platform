"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface PrismVaultWebGLProps {
  wireframeOnly?: boolean;
  roughness?: number;
  transmission?: number;
  rotationSpeed?: number;
  coreColor?: string;
  ringCount?: number;
}

export function PrismVaultWebGL({
  wireframeOnly = false,
  roughness = 0.15,
  transmission = 0.9,
  rotationSpeed = 0.008,
  coreColor = "#0052FF",
  ringCount = 3,
}: PrismVaultWebGLProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    // Transparent or light background
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Lighting setup for warm light-mode canvas
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0052ff, 1.8);
    dirLight2.position.set(-5, -4, 3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x00f59b, 2.0, 10);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central Faceted Crystal Jewel (Icosahedron + Wireframe Overlay)
    const crystalGeo = new THREE.IcosahedronGeometry(1.8, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(coreColor),
      emissive: new THREE.Color(0x001a4d),
      metalness: 0.1,
      roughness: roughness,
      transmission: transmission,
      ior: 1.52,
      thickness: 1.2,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      transparent: true,
      opacity: wireframeOnly ? 0.2 : 0.85,
      wireframe: wireframeOnly,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    rootGroup.add(crystalMesh);

    // Wireframe edges on crystal
    const wireframeGeo = new THREE.WireframeGeometry(crystalGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x0052ff,
      transparent: true,
      opacity: 0.6,
      linewidth: 1,
    });
    const wireframeLines = new THREE.LineSegments(wireframeGeo, wireframeMat);
    crystalMesh.add(wireframeLines);

    // 2. Inner Glowing Core (Octahedron)
    const innerGeo = new THREE.OctahedronGeometry(0.7, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x00f59b,
      emissive: 0x00a86b,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.2,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerCore);

    // 3. Orbital Titanium Rings
    const rings: THREE.Mesh[] = [];
    const ringRadii = [2.6, 3.1, 3.6];
    const ringColors = [0x0052ff, 0x059669, 0x7c3aed];

    for (let i = 0; i < Math.min(ringCount, 3); i++) {
      const ringGeo = new THREE.TorusGeometry(ringRadii[i], 0.025, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: ringColors[i],
        metalness: 0.9,
        roughness: 0.2,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / (3 + i);
      ringMesh.rotation.y = (Math.PI / 4) * i;
      rootGroup.add(ringMesh);
      rings.push(ringMesh);

      // Micro satellites on each ring
      const satGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: 0x0b0f19,
        metalness: 0.9,
        roughness: 0.1,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satMesh.position.x = ringRadii[i];
      ringMesh.add(satMesh);
    }

    // 4. Subtle Floating Particle Points
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 3.5 + Math.random() * 2.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x0052ff,
      size: 0.04,
      transparent: true,
      opacity: 0.4,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particlePoints);

    // Mouse Interaction Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetX = x * 0.8;
      targetY = y * 0.8;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop & FPS Tracking
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();
    let animId: number;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      rootGroup.rotation.y += rotationSpeed;
      rootGroup.rotation.x = mouseY * 0.5;
      rootGroup.rotation.z = mouseX * 0.3;

      // Independent sub-rotations
      crystalMesh.rotation.y += rotationSpeed * 0.5;
      crystalMesh.rotation.x += rotationSpeed * 0.3;
      innerCore.rotation.y -= rotationSpeed * 1.5;

      rings.forEach((ring, idx) => {
        ring.rotation.z += (idx % 2 === 0 ? 1 : -1) * rotationSpeed * (1 + idx * 0.4);
      });

      particlePoints.rotation.y += rotationSpeed * 0.2;

      renderer.render(scene, camera);

      // FPS Calculation
      frameCount++;
      if (now - lastFpsUpdate >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = now;
      }
    };

    animId = requestAnimationFrame(animate);

    // Clean up
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose resources
      crystalGeo.dispose();
      crystalMat.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [wireframeOnly, roughness, transmission, rotationSpeed, coreColor, ringCount]);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Real-Time WebGL HUD Telemetry Badge */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-600 flex items-center gap-2 pointer-events-none shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Three.js WebGL: <strong className="text-slate-900 font-bold">{fps} FPS</strong></span>
        <span>·</span>
        <span>DrawCalls: <strong className="text-blue-700 font-bold">6</strong></span>
      </div>
    </div>
  );
}
