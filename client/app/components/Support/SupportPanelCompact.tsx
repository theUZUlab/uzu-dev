"use client";

import { useEffect, useRef } from "react";

export default function SupportPanelCompact() {
  const regionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 필요 시 첫 탭 이동 시 영역으로 포커스 유도
    regionRef.current?.setAttribute("tabindex", "-1");
  }, []);

  const titleId = "support-panel-compact-title";
  const descId = "support-panel-compact-desc";

  return (
    <div
      ref={regionRef}
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="rounded-2xl mt-4"
    >
      {/* 상단 메시지 */}
      <div className="text-center">
        <h3
          id={titleId}
          className="text-lg font-black text-[var(--color-text)] tracking-tight"
        >
          따뜻한 관심과 응원에
          <br />
          감사드립니다.
        </h3>
        <p
          id={descId}
          className="mt-2 text-sm font-semibold text-[var(--color-text)]/80 leading-relaxed"
        >
          여러분의 후원은 제가 프로젝트를 꾸준히 개발하고, 학습 자료와 경험을 나누는 데 큰 힘이
          됩니다.
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="mt-4 flex justify-center">
        <div
          className="
            w-full max-w-[220px] relative rounded-[var(--radius-xl)] p-0.5
            aurora-frame transition-colors motion-reduce:[animation:none]
          "
        >
          <a
            href="https://buymeacoffee.com/uzulabstudf"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2
              aurora-inner bg-[var(--color-panel)]
              rounded-[var(--radius-lg)]
              px-4 py-2 font-bold
              hover:text-[var(--color-brand)]
              transition-colors
            "
            aria-label="Buy Me a Coffee로 이동"
          >
            <span aria-hidden>☕</span>
            <span>Buy Me a Coffee</span>
          </a>
        </div>
      </div>
    </div>
  );
}
