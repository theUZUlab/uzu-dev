"use client";

import ThemedIcon from "@/app/components/Ui/ThemedIcon";
import ThemeToggle from "@/app/components/Ui/ThemeToggle";

export default function Footer() {
  const logoProps = {
    alt: "UZU Logo",
    light: {
      base: "/images/light/logo.svg",
      hover: "/images/light/logo.svg",
      focus: "/images/light/logo.svg",
    },
    dark: {
      base: "/images/dark/logo.svg",
      hover: "/images/dark/logo.svg",
      focus: "/images/dark/logo.svg",
    },
  } as const;

  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 opacity-50">
      <div
        className="
          mx-auto max-w-screen-2xl 2xl:max-w-[1440px]
          py-5 md:py-7 
          px-4 lg:px-8 2xl:px-10
          flex flex-col items-center
          md:flex-row md:items-center gap-4 md:gap-8 lg:gap-16
        "
      >
        {/* 로고 */}
        <div className="shrink-0">
          {/* 모바일 (< md) */}
          <span className="block md:hidden">
            <ThemedIcon {...logoProps} width={60} height={45} />
          </span>
          {/* 태블릿 (md ~ lg) */}
          <span className="hidden md:block lg:hidden">
            <ThemedIcon {...logoProps} width={80} height={58} />
          </span>
          {/* 데스크톱 (lg 이상) */}
          <span className="hidden lg:block">
            <ThemedIcon {...logoProps} width={95} height={68} />
          </span>
        </div>

        {/* 텍스트 블럭 */}
        <div className="text-center md:text-left text-[var(--color-text)] space-y-0 md:space-y-1">
          <p className="text-xs lg:text-base">
            <span className="text-[var(--color-text)]">Personal Inquiries</span>
            <span className="mx-2">|</span>
            <a
              href="mailto:uzulab.studio@gmail.com"
              className="underline-offset-2 hover:underline hover:text-[var(--color-brand)]"
            >
              uzulab.studio@gmail.com
            </a>
          </p>

          <p className="text-xs lg:text-base">
            <span className="text-[var(--color-text)]">Service Inquiries</span>
            <span className="mx-2">|</span>
            <a
              href="mailto:uzulab.official@gmail.com"
              className="underline-offset-2 hover:underline hover:text-[var(--color-brand)]"
            >
              uzulab.official@gmail.com
            </a>
          </p>

          <p className="text-xs lg:text-base mt-1 md:mt-3 text-[var(--color-text)]">
            © {year} UZU! All rights reserved.
          </p>
        </div>

        <div className="md:ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
