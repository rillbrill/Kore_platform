"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Globe,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login, updateUserProfile } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("싱가포르 (Singapore)");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) return;

    setLoading(true);
    setTimeout(() => {
      login(email);
      updateUserProfile({ country, email });
      router.push("/kyc");
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-6 font-sans">
      {/* Brand & Title */}
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-slate-950 text-white font-mono font-bold text-base flex items-center justify-center mx-auto shadow-md">
          H
        </div>
        <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
          Hanchi 회원가입
        </h1>
        <p className="text-xs text-slate-500 font-sans">
          간단한 가입 후 4단계 외국인 적격 투자자 인증(KYC)을 진행합니다.
        </p>
      </div>

      {/* Register Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium block">이메일 주소</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-slate-200 font-mono text-xs focus:outline-none focus:border-slate-400"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium block">거주 국가 / 세무 관할</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="싱가포르 (Singapore)">싱가포르 (Singapore)</option>
                <option value="홍콩 (Hong Kong)">홍콩 (Hong Kong)</option>
                <option value="미국 (United States / Accredited)">미국 (United States / 적격)</option>
                <option value="일본 (Japan)">일본 (Japan)</option>
                <option value="영국 (United Kingdom)">영국 (United Kingdom)</option>
                <option value="기타 외국인 거주자 (Other Non-Resident)">기타 외국인 거주자 (Other)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium block">비밀번호 설정</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상, 영문/숫자/특수문자 포함"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-slate-200 font-mono text-xs focus:outline-none focus:border-slate-400"
                required
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 mt-0.5 cursor-pointer"
                required
              />
              <span className="text-[11.5px] text-slate-600 leading-relaxed">
                Hanchi 서비스 이용약관 및 개인정보 처리방침에 동의하며, 외국인 적격 투자자 인증 절차 진행에 동의합니다.
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full h-10"
            disabled={!termsAgreed || !email.trim() || !password.trim()}
            isLoading={loading}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            계정 생성 및 KYC 시작하기
          </Button>
        </form>
      </div>

      {/* Login Link */}
      <div className="text-center space-y-4 text-xs text-slate-500">
        <p>
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-semibold text-slate-950 underline hover:text-blue-600">
            기존 계정으로 로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
