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

  // 높이 전환(접힘/펼침) 부드럽게 처리
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    // 열기: 현재 높이를 실제 스크롤 높이로 설정 → 끝나면 auto로
    if (open) {
      el.style.height = "auto";
      const target = `${el.scrollHeight}px`;
      el.style.height = "0px"; // 트리거용 초기값
      // 다음 프레임에 실제 높이로
      requestAnimationFrame(() => {
        el.style.height = target;
      });

      const onEnd = () => {
        el.style.height = "auto";
        el.removeEventListener("transitionend", onEnd);
      };
      el.addEventListener("transitionend", onEnd);
    } else {
      // 닫기: 현재 auto면 실제 픽셀값을 넣고 다음 프레임에 0으로
      const current = el.scrollHeight;
      el.style.height = `${current}px`;
      requestAnimationFrame(() => {
        el.style.height = "0px";
      });
    }
  }, [open]);

  return (
    <section>
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
          <div className="text-left">{title}</div>
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
        // 기본 높이 상태(초기 렌더링 시)
        style={{ height: open ? "auto" : 0 }}
        className="overflow-hidden transition-[height] duration-200"
      >
        <div>{children}</div>
      </div>
    </section>
  );
}
