"use client";

import Image from "next/image";
import Link from "next/link";
import { ElementType } from "react";

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
  const Wrapper: ElementType = href ? Link : "span";
  const wrapperProps = href
    ? {
        href,
        "aria-label": alt,
        className: ["inline-flex items-center", wrapperClassName].filter(Boolean).join(" "),
      }
    : { className: wrapperClassName };

  return (
    <Wrapper {...wrapperProps}>
      <span
        className={[
          "relative inline-flex items-center justify-center outline-none group",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ width, height }}
      >
        {/* ---------- Light ---------- */}
        {/* base */}
        <Image
          src={light.base}
          alt={decorative ? "" : alt}
          aria-hidden={decorative || undefined}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          decoding={priority ? undefined : "async"}
          className="
            block dark:hidden
            opacity-100 group-hover:opacity-0 group-focus:opacity-0
            transition-opacity
            select-none pointer-events-none
            object-contain
          "
          sizes={`${width}px`}
        />
        {/* hover */}
        {light.hover && (
          <Image
            src={light.hover}
            alt=""
            aria-hidden
            fill
            className="
              block dark:hidden
              opacity-0 group-hover:opacity-100 group-focus:opacity-0
              transition-opacity
              select-none pointer-events-none
              object-contain
            "
            sizes={`${width}px`}
          />
        )}
        {/* focus */}
        {light.focus && (
          <Image
            src={light.focus}
            alt=""
            aria-hidden
            fill
            className="
              block dark:hidden
              opacity-0 group-focus:opacity-100
              transition-opacity
              select-none pointer-events-none
              object-contain
            "
            sizes={`${width}px`}
          />
        )}

        {/* ---------- Dark ---------- */}
        {/* base */}
        <Image
          src={dark.base}
          alt={decorative ? "" : alt}
          aria-hidden={decorative || undefined}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          decoding={priority ? undefined : "async"}
          className="
            hidden dark:block
            opacity-100 group-hover:opacity-0 group-focus:opacity-0
            transition-opacity
            select-none pointer-events-none
            object-contain
          "
          sizes={`${width}px`}
        />
        {/* hover */}
        {dark.hover && (
          <Image
            src={dark.hover}
            alt=""
            aria-hidden
            fill
            className="
              hidden dark:block
              opacity-0 group-hover:opacity-100 group-focus:opacity-0
              transition-opacity
              select-none pointer-events-none
              object-contain
            "
            sizes={`${width}px`}
          />
        )}
        {/* focus */}
        {dark.focus && (
          <Image
            src={dark.focus}
            alt=""
            aria-hidden
            fill
            className="
              hidden dark:block
              opacity-0 group-focus:opacity-100
              transition-opacity
              select-none pointer-events-none
              object-contain
            "
            sizes={`${width}px`}
          />
        )}
      </span>
    </Wrapper>
  );
}
