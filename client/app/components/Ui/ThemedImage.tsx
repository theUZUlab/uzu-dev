"use client";

import Link from "next/link";
import Image, { type ImageProps } from "next/image";

type Props = Omit<ImageProps, "src" | "alt" | "fill"> & {
  alt: string;
  lightSrc: string;
  darkSrc: string;
  href?: string;
  wrapperClassName?: string;
  /** fill 이미지 sizes. 기본 100vw */
  sizes?: string;
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
  sizes = "100vw",
  ...img
}: Props) {
  const node = (
    <span className={["relative block w-full h-full", wrapperClassName].filter(Boolean).join(" ")}>
      {/* Light */}
      <Image
        {...img}
        src={lightSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? undefined : "async"}
        className={["theme-light object-cover", className].filter(Boolean).join(" ")}
      />
      {/* Dark */}
      <Image
        {...img}
        src={darkSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? undefined : "async"}
        className={["theme-dark object-cover", className].filter(Boolean).join(" ")}
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
