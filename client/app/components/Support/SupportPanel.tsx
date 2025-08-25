"use client";

export default function SupportPanel() {
  return (
    <div
      className="
        w-[250px] md:w-[330px] lg:w-[400px]
        rounded-xl lg:rounded-2xl
        border-2 border-[var(--color-line)]
        bg-[var(--color-panel)]
        p-4 md:p-5 lg:p-6
      "
      role="dialog"
      aria-label="Support panel"
    >
      {/* 상단 메시지 */}
      <div className="text-center mb-4 md:mb-5 lg:mb-6">
        <p className="text-base md:text-lg lg:text-xl font-black text-[var(--color-text)] tracking-tight">
          따뜻한 관심과 응원에
          <br className="hidden lg:block" /> 감사합니다.
        </p>
        <p className="mt-2 md:mt-3 text-xs md:text-sm lg:text-base text-[var(--color-text)] opacity-80 leading-relaxed">
          여러분의 후원은 제가 프로젝트를 꾸준히 개발하고, 학습 자료와 경험을 나누는 데 큰 힘이
          됩니다.
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-center">
        <div
          className="
            w-full max-w-[220px] relative rounded-[var(--radius-xl)] p-0.5
            transition-colors aurora-frame
          "
        >
          <a
            href="https://buymeacoffee.com/uzulabstudf"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2
              !bg-[var(--color-bg)] aurora-inner
              rounded-[var(--radius-xl)]
              px-3 py-2 md:px-4 lg:px-5
              text-sm md:text-base font-bold
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
