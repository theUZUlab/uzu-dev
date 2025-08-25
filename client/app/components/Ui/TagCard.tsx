import type { PropsWithChildren } from "react";

export default function TagCard({ children }: PropsWithChildren) {
  return (
    <span
      className="
        inline-flex items-center rounded-md
        bg-[var(--color-bg)] px-3 py-1
        text-sm md:text-base font-semibold
        text-[var(--color-text)]
      "
    >
      {children}
    </span>
  );
}
