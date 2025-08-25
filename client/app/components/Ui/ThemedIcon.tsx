"use client";

import Link from "next/link";
import Image from "next/image";

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
  /** fill 사용 시 권장. 미지정 시 100vw */
  sizes?: string;
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
  sizes = "100vw",
}: Props) {
  const content = (
    <InnerIcon
      alt={alt}
      width={width}
      height={height}
      className={className}
      light={light}
      dark={dark}
      priority={priority}
      decorative={decorative}
      sizes={sizes}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={decorative ? undefined : alt}
        className={["inline-flex items-center", wrapperClassName].filter(Boolean).join(" ")}
      >
        {content}
      </Link>
    );
  }

  return <span className={wrapperClassName}>{content}</span>;
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
  sizes,
}: Omit<Props, "href" | "wrapperClassName">) {
  const ariaHidden = decorative ? true : undefined;

  return (
    <span
      className={["relative inline-flex items-center justify-center outline-none group", className]
        .filter(Boolean)
        .join(" ")}
      style={{ width, height }}
      aria-hidden={ariaHidden}
    >
      {/* ---------- Light ---------- */}
      <Image
        src={light.base}
        alt={decorative ? "" : alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? undefined : "async"}
        sizes={sizes}
        className="theme-light opacity-100 group-hover:opacity-0 group-focus:opacity-0 transition-opacity select-none pointer-events-none object-contain"
      />
      {light.hover && (
        <Image
          src={light.hover}
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          className="theme-light opacity-0 group-hover:opacity-100 group-focus:opacity-0 transition-opacity select-none pointer-events-none object-contain"
        />
      )}
      {light.focus && (
        <Image
          src={light.focus}
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          className="theme-light opacity-0 group-focus:opacity-100 transition-opacity select-none pointer-events-none object-contain"
        />
      )}

      {/* ---------- Dark ---------- */}
      <Image
        src={dark.base}
        alt={decorative ? "" : alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? undefined : "async"}
        sizes={sizes}
        className="theme-dark opacity-100 group-hover:opacity-0 group-focus:opacity-0 transition-opacity select-none pointer-events-none object-contain"
      />
      {dark.hover && (
        <Image
          src={dark.hover}
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          className="theme-dark opacity-0 group-hover:opacity-100 group-focus:opacity-0 transition-opacity select-none pointer-events-none object-contain"
        />
      )}
      {dark.focus && (
        <Image
          src={dark.focus}
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          className="theme-dark opacity-0 group-focus:opacity-100 transition-opacity select-none pointer-events-none object-contain"
        />
      )}
    </span>
  );
}
