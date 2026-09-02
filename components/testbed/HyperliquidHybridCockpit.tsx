"use client";

import React from "react";
import { HyperliquidWaterfallVisual } from "@/components/testbed/HyperliquidWaterfallVisual";
import { DvpTelemetryMatrix } from "@/components/testbed/DvpTelemetryMatrix";
import { Badge } from "@/components/ui/Badge";
import { Terminal, Zap, ShieldCheck } from "lucide-react";

export function HyperliquidHybridCockpit() {
  return (
    <div className="space-y-6">
      {/* 1. Visual Waterfall Gantt */}
      <HyperliquidWaterfallVisual />

      {/* 2. Real-Time Telemetry Stream Table */}
      <DvpTelemetryMatrix />
    </div>
  );
}
