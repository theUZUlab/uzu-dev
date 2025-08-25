// components/Ui/ThemedImage.tsx
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
  className,
  ...img
}: Props) {
  const node = (
    <span
      className={[
        // ↓↓↓ 여기 w-full h-full 추가가 핵심
        "relative block w-full h-full",
        wrapperClassName,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Light */}
      <Image
        {...img}
        src={lightSrc}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? undefined : "async"}
        className={["theme-light", "object-cover", className].filter(Boolean).join(" ")}
      />
      {/* Dark */}
      <Image
        {...img}
        src={darkSrc}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? undefined : "async"}
        className={["theme-dark", "object-cover", className].filter(Boolean).join(" ")}
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
