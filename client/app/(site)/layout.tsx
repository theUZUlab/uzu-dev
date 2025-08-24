import Header from "@/app/components/Header/Header";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import { SidebarProvider } from "@/app/components/Sidebar/SidebarContext";

import Footer from "../components/Footer/Footer";

import type { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-dvh flex flex-col">
        <Header />
        <Sidebar />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
