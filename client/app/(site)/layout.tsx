import type { ReactNode } from "react";

import Header from "@/app/components/Header/Header";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import { SidebarProvider } from "@/app/components/Sidebar/SidebarContext";
import Footer from "@/app/components/Footer/Footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      {/* 스킵 링크 (키보드 사용자용) */}
      <a
        href="#site-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-[var(--color-panel)] focus:px-3 focus:py-2 focus:border focus:border-[var(--color-line)]"
      >
        본문으로 건너뛰기
      </a>

      <div className="min-h-dvh flex flex-col">
        <Header />
        <Sidebar />
        <main id="site-main" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
