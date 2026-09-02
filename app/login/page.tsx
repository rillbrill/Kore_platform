"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ViewSwitcher } from "@/components/ui/ViewSwitcher";
import { ShieldCheck, Lock, Mail, Wallet, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, language, setLanguage } = useApp();
  const [email, setEmail] = useState("a.vance@global-invest.com");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email);
      router.push("/account");
    }, 500);
  };

  const handleQuickWallet = () => {
    setLoading(true);
    setTimeout(() => {
      login("wallet-user@hanchi.finance");
      router.push("/markets");
    }, 500);
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", background: "#F1F3F0", color: "#14151A" }}>
      <ViewSwitcher />

      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 40px" }}>
        {/* Navigation Bar */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "82px", borderBottom: "1px solid rgba(0,0,0,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "44px" }}>
            <Link href="/" className="disp" style={{ fontWeight: 700, fontSize: "22px", letterSpacing: "-.02em" }}>
              KORE<span style={{ color: "#14151A", background: "#C4F542", padding: "0 4px", marginLeft: "1px", borderRadius: "3px" }}>.</span>
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => setLanguage(language === "KO" ? "EN" : "KO")}
              className="navlink mono"
              style={{ background: "none", border: 0, cursor: "pointer", fontSize: "12px", letterSpacing: ".06em" }}
            >
              {language === "KO" ? "KR · KRW" : "EN · USD"}
            </button>
            <Link href="/register" className="navlink mono" style={{ fontSize: "13px" }}>
              Register Institutional Account →
            </Link>
          </div>
        </nav>

        {/* Login Box */}
        <section style={{ padding: "60px 0 100px", maxWidth: "460px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div className="disp" style={{ fontWeight: 700, fontSize: "32px" }}>
              KORE<span style={{ color: "#14151A", background: "#C4F542", padding: "0 4px", marginLeft: "2px", borderRadius: "3px" }}>.</span>
            </div>
            <h1 className="disp" style={{ margin: "12px 0 6px", fontSize: "24px", fontWeight: 700 }}>
              Institutional Portal Login
            </h1>
            <p style={{ margin: 0, fontSize: "14px", color: "#5B5D5A" }}>
              Access 1:1 KSD custodied KOSPI 200 tokenized equities
            </p>
          </div>

          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.09)", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            <form onSubmit={handleSubmit} className="mono" style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "12.5px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ color: "#5B5D5A" }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: "12px 14px", background: "#F1F3F0", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "13.5px", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ color: "#5B5D5A" }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ padding: "12px 14px", background: "#F1F3F0", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "13.5px", outline: "none" }}
                />
              </div>

              <button
                type="submit"
                className="btn-a"
                style={{ cursor: "pointer", border: 0, background: "#C4F542", color: "#14151A", padding: "14px", borderRadius: "999px", fontSize: "14px", fontWeight: 700, marginTop: "6px" }}
              >
                {loading ? "Authenticating..." : "Sign In to Account →"}
              </button>

              <div style={{ textAlign: "center", margin: "8px 0", color: "#9EA09B", fontSize: "11px" }}>OR CONNECT WITH WEB3</div>

              <button
                type="button"
                onClick={handleQuickWallet}
                className="btn-a"
                style={{ cursor: "pointer", border: "1px solid rgba(0,0,0,0.12)", background: "#14151A", color: "#F2F1EC", padding: "12px", borderRadius: "999px", fontSize: "13px", fontWeight: 600 }}
              >
                Connect Institutional Web3 Wallet
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(0,0,0,.1)", padding: "30px 0 60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: "12px", color: "#9EA09B" }}>© 2026 KORE Markets · Tokenized securities. Capital at risk.</span>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/rights" className="navlink mono" style={{ fontSize: "12px" }}>Disclosures</Link>
            <Link href="/rights" className="navlink mono" style={{ fontSize: "12px" }}>Custody</Link>
            <Link href="/support" className="navlink mono" style={{ fontSize: "12px" }}>Terms</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
