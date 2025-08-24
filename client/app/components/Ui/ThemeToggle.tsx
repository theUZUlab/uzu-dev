"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark";
const THEME_KEY = "uzu-theme";

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as Mode | null) ?? "dark";
    setMode(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleMode = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={toggleMode}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      className={[
        "relative inline-flex items-center rounded-full hover:cursor-pointer",
        "w-10 h-5",
        "md:w-14 md:h-8",
        "lg:w-20 lg:h-10",
        isDark ? "bg-[var(--color-brand)]" : "bg-[var(--color-brand)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]",
        "transition-colors duration-300 motion-reduce:transition-none",
      ].join(" ")}
    >
      {/* 노브(동그라미) + 아이콘 */}
      <span
        className={[
          "absolute rounded-full bg-white shadow-md flex items-center justify-center",
          "top-0.5 left-0.5",
          "w-4 h-4",
          "md:w-7 md:h-7",
          "lg:w-9 lg:h-9",
          isDark ? "translate-x-0" : "translate-x-5 md:translate-x-6 lg:translate-x-10",
          "transition-transform duration-300 will-change-transform motion-reduce:transition-none",
        ].join(" ")}
      >
        {isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-[var(--color-brand)]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-[var(--color-brand)]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <circle cx="12" cy="12" r="5" />
          </svg>
        )}
      </span>
    </button>
  );
}
