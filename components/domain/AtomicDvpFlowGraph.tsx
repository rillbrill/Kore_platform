"use client";

import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Landmark, Building2, Activity, Zap, CheckCircle2, ArrowRight, Lock } from "lucide-react";
import { clsx } from "clsx";

interface AtomicDvpFlowGraphProps {
  className?: string;
  activeTxHash?: string;
}

export function AtomicDvpFlowGraph({
  className,
  activeTxHash = "0x8fa4...c391",
}: AtomicDvpFlowGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<number>(2); // Default to KSD

  const nodes = [
    {
      id: "INVESTOR",
      title: "적격 외국인 투자자",
      sub: "LEI-SG-2026-992140",
      type: "BUYER_SIGNER",
      status: "VERIFIED",
      role: "EIP-712 주문 인가 서명",
      color: "#0052FF",
      stat: "24/7 OTC Wallet",
    },
    {
      id: "BROKER",
      title: "하나증권 글로벌 본부",
      sub: "KRX Member #028",
      type: "EXECUTION_DESK",
      status: "EXECUTED",
      role: "KRX 정규장 원주 체결 및 청약 정산",
      color: "#2563EB",
      stat: "T+2 KRX Link",
    },
    {
      id: "KSD",
      title: "한국예탁결제원 (KSD)",
      sub: "KSD-OMNI-2026-KRX01",
      type: "CENTRAL_REGISTRY",
      status: "RECONCILED",
      role: "외국인 통합계좌 1:1 전자등록 대사",
      color: "#059669",
      stat: "Omnibus Proof",
    },
    {
      id: "TRUSTEE",
      title: "신한은행 신탁사업부",
      sub: "TRUST ACT ART.22",
      type: "CUSTODY_LOCKBOX",
      status: "BANKRUPTCY_REMOTE",
      role: "신탁법 제22조 실물 원주 1:1 도산격리 보관",
      color: "#0D9488",
      stat: "100% Insolvency Safe",
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = (canvas.width = rect.width * dpr);
    const height = (canvas.height = rect.height * dpr);
    ctx.scale(dpr, dpr);

    const displayWidth = rect.width;
    const displayHeight = rect.height;

    let time = 0;
    let animId: number;

    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.02;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const nodeCount = nodes.length;
      const spacing = displayWidth / (nodeCount + 1);
      const centerY = displayHeight / 2;

      const nodePositions = nodes.map((_, i) => ({
        x: (i + 1) * spacing,
        y: centerY,
      }));

      // 1. Draw Connecting Laser Pipeline Lines
      for (let i = 0; i < nodePositions.length - 1; i++) {
        const p1 = nodePositions[i];
        const p2 = nodePositions[i + 1];

        // Base Track
        ctx.strokeStyle = "rgba(0, 82, 255, 0.15)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Pulsing Data Stream Dashes
        ctx.strokeStyle = "rgba(0, 82, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 12]);
        ctx.lineDashOffset = -time * 25;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated Cryptographic Packet Dot
        const segT = (time * 0.8 + i * 0.33) % 1;
        const packetX = p1.x + (p2.x - p1.x) * segT;
        const packetY = p1.y;

        ctx.fillStyle = "#00F59B";
        ctx.shadowColor = "#00F59B";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(packetX, packetY, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 2. Draw Node Circles and Badges
      nodePositions.forEach((pos, idx) => {
        const isSelected = selectedNode === idx;
        const node = nodes[idx];

        // Outer Aura Ring
        ctx.strokeStyle = isSelected ? node.color : "rgba(15, 23, 42, 0.1)";
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.fillStyle = "#FFFFFF";

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isSelected ? 22 : 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner Core Point
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isSelected ? 9 : 7, 0, Math.PI * 2);
        ctx.fill();

        // Label Underneath
        ctx.fillStyle = isSelected ? "#0B0F19" : "#64748B";
        ctx.font = isSelected ? "bold 11px sans-serif" : "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.title, pos.x, pos.y + 36);

        ctx.fillStyle = isSelected ? "#0052FF" : "#94A3B8";
        ctx.font = "9.5px monospace";
        ctx.fillText(node.stat, pos.x, pos.y + 50);
      });
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const spacing = rect.width / (nodes.length + 1);

    nodes.forEach((_, idx) => {
      const nodeX = (idx + 1) * spacing;
      if (Math.abs(x - nodeX) < 40) {
        setSelectedNode(idx);
      }
    });
  };

  const activeNodeData = nodes[selectedNode];

  return (
    <div className={clsx("rounded-2xl p-5 dex-card space-y-4 font-mono text-xs relative", className)}>
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-slate-950 text-xs">
            4ms 원자적 DVP 결제 파이프라인 (Atomic DVP Topology)
          </span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            T+0 REAL-TIME
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>TX: <strong className="text-slate-900 font-bold">{activeTxHash}</strong></span>
          <span>·</span>
          <span>지연율: <strong className="text-blue-700 font-bold">4.2ms</strong></span>
        </div>
      </div>

      {/* Interactive Topology Canvas */}
      <div className="relative w-full h-44 bg-slate-50/70 rounded-xl border border-slate-200/80 overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-pointer block"
        />

        {/* Top Help Tip */}
        <div className="absolute top-2.5 right-3 text-[10px] text-slate-400 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200 pointer-events-none">
          각 노드를 클릭하면 실시간 법적 수탁 및 검증 내역이 표시됩니다
        </div>
      </div>

      {/* Dynamic Selected Node Inspector Card */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeNodeData.color }} />
            <strong className="text-slate-950 font-bold text-xs">{activeNodeData.title}</strong>
            <Badge variant="teal" size="sm">
              {activeNodeData.sub}
            </Badge>
          </div>
          <p className="text-slate-600 font-sans text-xs">
            {activeNodeData.role}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[10px] text-slate-400">검증 상태:</span>
          <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            100% RECONCILED
          </span>
        </div>
      </div>
    </div>
  );
}
