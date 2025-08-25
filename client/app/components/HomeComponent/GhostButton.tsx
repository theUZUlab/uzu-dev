import Link from "next/link";

import type React from "react";

export default function GhostButton({
  href,
  children,
  disabled,
  label,
  className,
}: {
  href?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  const text = label ?? children;
  const isLink = !!href && !disabled;

  const baseClasses = [
    "block rounded-md aurora-inner py-1 md:py-2 text-center text-sm md:text-base font-semibold !bg-[var(--color-bg)]",
    className ?? "",
  ].join(" ");

  return (
    <div className="inline-block rounded-md p-0.5 aurora-frame transition-colors">
      {isLink ? (
        <Link href={href!} target="_blank" rel="noopener noreferrer" className={baseClasses}>
          {text}
        </Link>
      ) : (
        <button
          disabled
          aria-disabled="true"
          title="Link is not available yet"
          className={baseClasses}
        >
          {text}
        </button>
      )}
    </div>
  );
}
