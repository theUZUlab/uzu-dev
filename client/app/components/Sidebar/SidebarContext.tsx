"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type SidebarContextType = {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

const Ctx = createContext<SidebarContextType | null>(null);
Ctx.displayName = "SidebarContext";

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);
  const toggleSidebar = useCallback(() => setOpen((v) => !v), []);

  // 사이드바 열릴 때 바디 스크롤 잠금 (모바일 UX) + ESC 닫기
  useEffect(() => {
    if (typeof document === "undefined") return;

    const rootEl = document.documentElement;

    if (open) {
      rootEl.classList.add("overflow-hidden");
    } else {
      rootEl.classList.remove("overflow-hidden");
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      rootEl.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", onKeyDown);
    };
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
