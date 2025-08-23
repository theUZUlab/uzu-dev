import "../globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";

import type { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-[var(--color-bg)] text-[color:var(--color-text)] font-sans">
        <div className="flex min-h-screen">
          {/* 사이드바 */}
          <Sidebar />

          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
