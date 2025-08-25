"use client";

import { PropsWithChildren, ReactNode, useEffect, useId, useRef, useState } from "react";

type Props = {
  title: ReactNode;
  defaultOpen?: boolean;
};

export default function Accordion({
  title,
  defaultOpen = false,
  children,
}: PropsWithChildren<Props>) {
  const baseId = useId();
  const btnId = `${baseId}-btn`;
  const panelId = `${baseId}-panel`;

  const [open, setOpen] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    if (open) {
      // 열기 애니메이션
      el.style.height = "auto";
      const target = `${el.scrollHeight}px`;
      el.style.height = "0px";
      requestAnimationFrame(() => {
        el.style.height = target;
      });

      const onEnd = () => {
        el.style.height = "auto";
        el.removeEventListener("transitionend", onEnd);
      };
      el.addEventListener("transitionend", onEnd);
    } else {
      // 닫기 애니메이션
      const current = el.scrollHeight;
      el.style.height = `${current}px`;
      requestAnimationFrame(() => {
        el.style.height = "0px";
      });
    }
  }, [open]);

  return (
    <div>
      <button
        id={btnId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="
          w-full hover:cursor-pointer pb-1
          text-lg lg:text-xl font-black
          text-[var(--color-text)] hover:text-[var(--color-brand)]
        "
      >
        <div className="flex items-center justify-between">
          <span className="text-left">{title}</span>
          <span
            className={[
              "i-lucide-chevron-down transition-transform duration-200",
              open ? "rotate-180" : "",
            ].join(" ")}
            aria-hidden
          />
        </div>
      </button>

      <div
        id={panelId}
        ref={panelRef}
        role="region"
        aria-labelledby={btnId}
        style={{ height: open ? "auto" : 0 }}
        className="overflow-hidden transition-[height] duration-200"
      >
        <div>{children}</div>
      </div>
    </div>
  );
}
