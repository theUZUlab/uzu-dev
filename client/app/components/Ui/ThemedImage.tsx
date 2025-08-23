"use client";

import Link from "next/link";
import Image, { ImageProps } from "next/image";

type Props = Omit<ImageProps, "src" | "alt"> & {
  alt: string;
  lightSrc: string;
  darkSrc: string;
  href?: string;
  wrapperClassName?: string;
  priority?: boolean;
};

export default function ThemedImage({
  lightSrc,
  darkSrc,
  alt,
  href,
  wrapperClassName,
  priority,
  ...img
}: Props) {
  const node = (
    <span className={["inline-flex items-center", wrapperClassName].filter(Boolean).join(" ")}>
      {/* Light */}
      <Image
        {...img}
        src={lightSrc}
        alt={alt}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? undefined : "async"}
        className={["block dark:hidden", img.className].filter(Boolean).join(" ")}
      />
      {/* Dark */}
      <Image
        {...img}
        src={darkSrc}
        alt={alt}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? undefined : "async"}
        className={["hidden dark:block", img.className].filter(Boolean).join(" ")}
      />
    </span>
  );
  return href ? (
    <Link href={href} aria-label={alt} className="inline-flex items-center">
      {node}
    </Link>
  ) : (
    node
  );
}
