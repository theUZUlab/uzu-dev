"use client";

import Image from "next/image";
import Link from "next/link";

type IconSrcSet = { base: string; hover?: string; focus?: string };

type Props = {
  alt: string;
  width: number;
  height: number;
  href?: string;
  className?: string;
  wrapperClassName?: string;
  light: IconSrcSet;
  dark: IconSrcSet;
  priority?: boolean;
  decorative?: boolean;
};

export default function ThemedIcon({
  alt,
  width,
  height,
  href,
  className,
  wrapperClassName,
  light,
  dark,
  priority = false,
  decorative = false,
}: Props) {
  if (href) {
    return (
      <Link
        href={href}
        aria-label={alt}
        className={["inline-flex items-center", wrapperClassName].filter(Boolean).join(" ")}
      >
        <InnerIcon
          alt={alt}
          width={width}
          height={height}
          className={className}
          light={light}
          dark={dark}
          priority={priority}
          decorative={decorative}
        />
      </Link>
    );
  }

  return (
    <span className={wrapperClassName}>
      <InnerIcon
        alt={alt}
        width={width}
        height={height}
        className={className}
        light={light}
        dark={dark}
        priority={priority}
        decorative={decorative}
      />
    </span>
  );
}

/* 내부 렌더 전용 컴포넌트 */
function InnerIcon({
  alt,
  width,
  height,
  className,
  light,
  dark,
  priority,
  decorative,
}: Omit<Props, "href" | "wrapperClassName">) {
  return (
    <span
      className={["relative inline-flex items-center justify-center outline-none group", className]
        .filter(Boolean)
        .join(" ")}
      style={{ width, height }}
    >
      {/* ---------- Light ---------- */}
      <Image
        src={light.base}
        alt={decorative ? "" : alt}
        aria-hidden={decorative || undefined}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? undefined : "async"}
        className="
          theme-light
          opacity-100 group-hover:opacity-0 group-focus:opacity-0
          transition-opacity
          select-none pointer-events-none
          object-contain
        "
        sizes={`${width}px`}
      />
      {light.hover && (
        <Image
          src={light.hover}
          alt=""
          aria-hidden
          fill
          className="
            theme-light
            opacity-0 group-hover:opacity-100 group-focus:opacity-0
            transition-opacity
            select-none pointer-events-none
            object-contain
          "
          sizes={`${width}px`}
        />
      )}
      {light.focus && (
        <Image
          src={light.focus}
          alt=""
          aria-hidden
          fill
          className="
            theme-light
            opacity-0 group-focus:opacity-100
            transition-opacity
            select-none pointer-events-none
            object-contain
          "
          sizes={`${width}px`}
        />
      )}

      {/* ---------- Dark ---------- */}
      <Image
        src={dark.base}
        alt={decorative ? "" : alt}
        aria-hidden={decorative || undefined}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? undefined : "async"}
        className="
          theme-dark
          opacity-100 group-hover:opacity-0 group-focus:opacity-0
          transition-opacity
          select-none pointer-events-none
          object-contain
        "
        sizes={`${width}px`}
      />
      {dark.hover && (
        <Image
          src={dark.hover}
          alt=""
          aria-hidden
          fill
          className="
            theme-dark
            opacity-0 group-hover:opacity-100 group-focus:opacity-0
            transition-opacity
            select-none pointer-events-none
            object-contain
          "
          sizes={`${width}px`}
        />
      )}
      {dark.focus && (
        <Image
          src={dark.focus}
          alt=""
          aria-hidden
          fill
          className="
            theme-dark
            opacity-0 group-focus:opacity-100
            transition-opacity
            select-none pointer-events-none
            object-contain
          "
          sizes={`${width}px`}
        />
      )}
    </span>
  );
}
