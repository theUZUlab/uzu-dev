import type { PropsWithChildren } from "react";

export default function TagCard({ children }: PropsWithChildren) {
  return (
    <span className="inline-flex items-center rounded-md bg-[color:var(--color-bg)] px-3 py-1 text-sm md:text-base font-semibold">
      {children}
    </span>
  );
}
