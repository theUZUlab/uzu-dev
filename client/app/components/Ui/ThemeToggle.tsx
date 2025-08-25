"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark";
const THEME_KEY = "uzu-theme";

function getSystemPref(): Mode {
  if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("dark");
  const [mounted, setMounted] = useState(false);

  // 초기 로드: 저장값 → 시스템 선호 순으로 결정
  useEffect(() => {
    const saved = (typeof window !== "undefined"
      ? (localStorage.getItem(THEME_KEY) as Mode | null)
      : null) as Mode | null;

    const initial = saved ?? getSystemPref();
    setMode(initial);
    document.documentElement.setAttribute("data-theme", initial);
    setMounted(true);

    // 다른 탭과 동기화
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_KEY && (e.newValue === "light" || e.newValue === "dark")) {
        setMode(e.newValue as Mode);
        document.documentElement.setAttribute("data-theme", e.newValue as Mode);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleMode = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_KEY, next);
    }
    document.documentElement.setAttribute("data-theme", next);
  };

  const isDark = mode === "dark";

  // 마운트 전에는 버튼 레이아웃만 유지 → 깜빡임 방지
  return (
    <button
      type="button"
      onClick={toggleMode}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      className={[
        "relative inline-flex items-center rounded-full hover:cursor-pointer",
        "w-10 h-5 md:w-14 md:h-8 lg:w-20 lg:h-10",
        "bg-[var(--color-brand)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]",
        "transition-colors duration-300 motion-reduce:transition-none",
      ].join(" ")}
    >
      <span
        className={[
          "absolute rounded-full bg-white shadow-md flex items-center justify-center",
          "top-0.5 left-0.5",
          "w-4 h-4 md:w-7 md:h-7 lg:w-9 lg:h-9",
          isDark ? "translate-x-0" : "translate-x-5 md:translate-x-6 lg:translate-x-10",
          "transition-transform duration-300 will-change-transform motion-reduce:transition-none",
        ].join(" ")}
        aria-hidden
      >
        {mounted && isDark ? (
          // Moon (dark)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-[var(--color-brand)]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
          </svg>
        ) : mounted ? (
          // Sun (light)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-[var(--color-brand)]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <circle cx="12" cy="12" r="5" />
          </svg>
        ) : null}
      </span>
    </button>
  );
}
