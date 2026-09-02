"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import { Navbar } from "@/components/ui/Navbar";
import { ViewSwitcher } from "@/components/ui/ViewSwitcher";
import { platformFetch, type Workflow, type WorkflowTimeline } from "@/lib/platform-api";
import { usePlatform } from "@/context/PlatformContext";

export default function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = use(params);
  const { token, connected, message: platformMessage, error: platformError } = usePlatform();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [timeline, setTimeline] = useState<WorkflowTimeline | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadWorkflow() {
    setLoading(true);
    setError(null);
    try {
      const [nextWorkflow, nextTimeline] = await Promise.all([
        platformFetch<Workflow>(`/workflows/${workflowId}`, { token }),
        platformFetch<WorkflowTimeline>(`/workflows/${workflowId}/timeline`, { token }),
      ]);
      setWorkflow(nextWorkflow);
      setTimeline(nextTimeline);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "workflow 조회에 실패했다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (connected) void loadWorkflow();
  }, [connected, workflowId, token]);

  return (
    <div style={{ minHeight: "100vh", position: "relative", background: "#F1F3F0", color: "#14151A" }}>
      <ViewSwitcher />

      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 40px" }}>
        <Navbar />

        <section style={{ padding: "28px 0 24px", borderBottom: "1px solid rgba(0,0,0,.1)" }}>
          <Link
            href="/investor/activities"
            className="mono"
            style={{ fontSize: "12px", color: "#5B5D5A", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "18px" }}
          >
            <ArrowLeft style={{ width: "14px", height: "14px" }} />
            주문과 활동으로 돌아가기
          </Link>

          <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", alignItems: "flex-end" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: "10px" }}>WORKFLOW TRACE</div>
              <h1 className="disp" style={{ margin: 0, fontSize: "38px", fontWeight: 700 }}>
                업무 상태 추적
              </h1>
              <p style={{ margin: "10px 0 0", color: "#5B5D5A", fontSize: "14px", maxWidth: "680px", lineHeight: 1.6 }}>
                주문, 권리, 복구 요청은 즉시 완료로 표시하지 않고 서버 workflow와 timeline projection으로 확인한다.
              </p>
            </div>

            <button
              type="button"
              onClick={loadWorkflow}
              disabled={!connected || loading}
              className="btn-a mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: 0,
                cursor: connected && !loading ? "pointer" : "not-allowed",
                fontSize: "12px",
                fontWeight: 700,
                color: "#14151A",
                background: connected && !loading ? "#C4F542" : "#EAEBE7",
                padding: "11px 18px",
                borderRadius: "999px",
              }}
            >
              <RefreshCw className={clsx("w-3.5 h-3.5", loading && "animate-spin")} />
              새로고침
            </button>
          </div>
        </section>

        <section style={{ padding: "28px 0 80px", display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px" }}>
          <aside style={{ background: "#fff", border: "1px solid rgba(0,0,0,.08)", borderRadius: "16px", padding: "20px", alignSelf: "start" }}>
            <div className="mono" style={{ fontSize: "11px", color: "#8A8C88", marginBottom: "6px" }}>Workflow ID</div>
            <div className="mono" style={{ fontSize: "13px", wordBreak: "break-all", fontWeight: 700 }}>{workflowId}</div>

            <div style={{ marginTop: "20px", display: "grid", gap: "12px" }}>
              <div>
                <div className="mono" style={{ fontSize: "11px", color: "#8A8C88" }}>API 상태</div>
                <strong style={{ fontSize: "13px" }}>{connected ? "rwa-8th 연결" : "목업 모드"}</strong>
              </div>
              <div>
                <div className="mono" style={{ fontSize: "11px", color: "#8A8C88" }}>Workflow 유형</div>
                <strong style={{ fontSize: "13px" }}>{workflow?.workflowType ?? "조회 전"}</strong>
              </div>
              <div>
                <div className="mono" style={{ fontSize: "11px", color: "#8A8C88" }}>Projection</div>
                <strong style={{ fontSize: "13px" }}>{timeline?.projection.projectionStatus ?? "UNKNOWN"}</strong>
                {timeline?.projection.projectionAsOf && (
                  <span className="mono" style={{ display: "block", marginTop: "3px", color: "#8A8C88", fontSize: "11px" }}>
                    {timeline.projection.projectionAsOf}
                  </span>
                )}
              </div>
            </div>

            {!connected && (
              <p style={{ margin: "18px 0 0", fontSize: "12px", lineHeight: 1.55, color: "#A06A28" }}>
                {platformError ?? platformMessage}
              </p>
            )}
            {error && (
              <p style={{ margin: "18px 0 0", fontSize: "12px", lineHeight: 1.55, color: "#A03A3A" }}>{error}</p>
            )}
          </aside>

          <div style={{ display: "grid", gap: "16px" }}>
            {workflow?.states?.length ? (
              <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,.08)", borderRadius: "16px", padding: "20px" }}>
                <h2 className="disp" style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: 700 }}>상태 축</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
                  {workflow.states.map((state) => (
                    <div key={`${state.axis}-${state.code}`} style={{ border: "1px solid rgba(0,0,0,.08)", borderRadius: "12px", padding: "12px", background: "#F8F9F7" }}>
                      <div className="mono" style={{ fontSize: "10px", color: "#8A8C88" }}>{state.axis}</div>
                      <strong style={{ display: "block", marginTop: "4px", fontSize: "13px" }}>{state.labelKo}</strong>
                      <span className="mono" style={{ display: "block", marginTop: "3px", fontSize: "11px", color: "#5B5D5A" }}>{state.code}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,.08)", borderRadius: "16px", padding: "20px" }}>
              <h2 className="disp" style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: 700 }}>Timeline</h2>
              {loading && <p style={{ margin: 0, color: "#5B5D5A", fontSize: "13px" }}>workflow timeline을 불러오는 중이다.</p>}
              {!loading && !timeline?.items.length && (
                <p style={{ margin: 0, color: "#5B5D5A", fontSize: "13px" }}>
                  아직 표시할 timeline event가 없다. API 연결 후 새로고침한다.
                </p>
              )}
              <div style={{ display: "grid", gap: "10px" }}>
                {timeline?.items.map((item) => (
                  <article key={item.eventId} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "16px", borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: "14px" }}>
                    <div className="mono" style={{ color: "#8A8C88", fontSize: "11px" }}>
                      <div>{new Date(item.occurredAt).toLocaleString("ko-KR", { hour12: false })}</div>
                      <div style={{ marginTop: "4px" }}>{item.category}</div>
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "14px" }}>{item.labelKo}</strong>
                      <span style={{ display: "block", marginTop: "4px", fontSize: "12px", color: "#5B5D5A" }}>
                        {item.actorRoleKo} · {item.recordLayerKo}
                      </span>
                      <span style={{ display: "block", marginTop: "4px", fontSize: "12px", color: "#3A3B38" }}>
                        다음 조치: {item.nextActionKo}
                      </span>
                      {(item.evidenceReference || item.transactionHash) && (
                        <span className="mono" style={{ display: "block", marginTop: "5px", fontSize: "11px", color: "#8A8C88", wordBreak: "break-all" }}>
                          {item.evidenceReference ?? item.transactionHash}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
