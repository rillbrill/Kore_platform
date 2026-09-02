import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { PlatformProvider } from "@/context/PlatformContext";
import { AgentCommandCenter } from "@/components/domain/AgentCommandCenter";

export const metadata: Metadata = {
  title: "KORE. | Tokenized Korean Equities & KOSPI 200 RWA",
  description:
    "Investor UI for the rwa-8th tokenized rights PoC, with workflow tracking and server projection state.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="bg-[#F1F3F0] text-[#14151A] font-sans antialiased min-h-screen">
        <PlatformProvider>
          <AppProvider>
            {children}
            <AgentCommandCenter />
          </AppProvider>
        </PlatformProvider>
      </body>
    </html>
  );
}
