"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type SidebarContextType = {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

const Ctx = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openSidebar = () => setOpen(true);
  const closeSidebar = () => setOpen(false);
  const toggleSidebar = () => setOpen((v) => !v);

  // 사이드바 열릴 때 바디 스크롤 잠금 (모바일 UX)
  useEffect(() => {
    if (open) document.documentElement.classList.add("overflow-hidden");
    else document.documentElement.classList.remove("overflow-hidden");
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <Ctx.Provider value={{ open, openSidebar, closeSidebar, toggleSidebar }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("SidebarProvider missing");
  return ctx;
}
