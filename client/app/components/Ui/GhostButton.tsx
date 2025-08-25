import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href?: string;
  children?: ReactNode;
  disabled?: boolean;
  label?: string;
  className?: string;
};

export default function GhostButton({ href, children, disabled, label, className }: Props) {
  const text = label ?? children;
  const isLink = !!href && !disabled;

  const baseClasses = [
    "block rounded-md aurora-inner py-1 md:py-2 text-center",
    "text-sm md:text-base font-semibold !bg-[var(--color-bg)]",
    className ?? "",
  ].join(" ");

  return (
    <div className="inline-block rounded-md p-0.5 aurora-frame transition-colors">
      {isLink ? (
        <Link
          href={href!}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
          aria-label={typeof text === "string" ? text : undefined}
        >
          {text}
        </Link>
      ) : (
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="링크 준비 중"
          className={baseClasses}
        >
          {text}
        </button>
      )}
    </div>
  );
}
