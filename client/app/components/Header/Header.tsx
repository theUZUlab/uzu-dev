"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useSidebar } from "@/app/components/Sidebar/SidebarContext";
import { listCategories } from "@/lib/api/meta";
import { CategoryStat } from "@/lib/types";
import ThemedIcon from "@/app/components/Ui/ThemedIcon";
import SupportPanel from "@/app/components/Support/SupportPanel";

export default function Header() {
  const { openSidebar } = useSidebar();
  const pathname = usePathname();

  const [projCats, setProjCats] = useState<CategoryStat[] | null>(null);
  const [blogCats, setBlogCats] = useState<CategoryStat[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function run() {
      try {
        setLoading(true);
        const [p, b] = await Promise.all([
          listCategories("project", { limit: 100 }),
          listCategories("blog", { limit: 100 }),
        ]);
        if (!alive) return;
        setProjCats(p);
        setBlogCats(b);
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, []);

  const isActive = (target: string, opts?: { startsWith?: boolean }) =>
    opts?.startsWith ? pathname.startsWith(target) : pathname === target;

  const linkCls = (target: string, opts?: { startsWith?: boolean }) => {
    const active = isActive(target, opts);
    return `font-black text-lg lg:text-xl transition-colors
      hover:text-[var(--color-brand)]
      ${active ? "text-[var(--color-brand)]" : "text-[var(--color-text)]"}`;
  };

  // 로고 공통 props
  const logoProps = {
    alt: "UZU Dev Logo",
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

  const totalProj = (projCats ?? []).reduce((acc, c) => acc + c.count, 0);
  const totalBlog = (blogCats ?? []).reduce((acc, c) => acc + c.count, 0);

  return (
    <header className="sticky top-0 z-40 backdrop-blur">
      <div
        className="
          mx-auto 
          max-w-screen-2xl 2xl:max-w-[1440px]
          py-5 md:py-7 
          px-4 lg:px-8 2xl:px-10
          flex items-center justify-between
        "
      >
        {/* 로고 */}
        <Link href="/" aria-label="홈으로" className="inline-flex items-center">
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
          <span className="sr-only">UZU-DEV</span>
        </Link>

        {/* PC 네비게이션 (md 이상) */}
        <nav
          className="hidden md:flex items-center gap-5 lg:gap-6 2xl:gap-8"
          aria-label="주요 메뉴"
        >
          <ul className="flex items-center gap-5 lg:gap-6 2xl:gap-8">
            <li>
              <Link
                href="/"
                className={linkCls("/")}
                aria-current={isActive("/") ? "page" : undefined}
              >
                Home
              </Link>
            </li>

            {/* Projects hover */}
            <li className="relative group">
              <Link
                href="/projects"
                className={linkCls("/projects", { startsWith: true })}
                aria-current={isActive("/projects", { startsWith: true }) ? "page" : undefined}
                aria-haspopup="true"
                aria-expanded="false"
              >
                Projects
              </Link>
              <div
                className="
                  pointer-events-none absolute left-1/2 top-full -translate-x-1/2
                  pt-6 opacity-0 transition-opacity duration-150
                  group-hover:opacity-100 group-hover:pointer-events-auto
                "
                role="menu"
                aria-label="Project categories"
              >
                <div className="min-w-52 lg:min-w-64 rounded-xl lg:rounded-2xl border-2 border-[var(--color-line)] bg-[var(--color-panel)] p-2">
                  {loading && (
                    <div className="px-2 py-2 text-xs text-[var(--color-text)]">불러오는 중…</div>
                  )}

                  {!loading && (
                    <ul className="max-h-64 lg:max-h-72 overflow-auto">
                      {/* All Projects */}
                      <li>
                        <Link
                          href="/projects"
                          className="
                            flex items-center justify-between rounded-md px-5 py-2 lg:text-lg font-bold
                            text-[var(--color-text)] hover:text-[var(--color-brand)]
                          "
                          role="menuitem"
                        >
                          <span>All Projects</span>
                          <span className="text-xs text-[var(--color-text)]">{totalProj}</span>
                        </Link>
                      </li>

                      {projCats && projCats.length > 0 ? (
                        projCats.map((c) => (
                          <li key={c.name}>
                            <Link
                              href={`/projects/${encodeURIComponent(c.name)}`}
                              className="
                                flex items-center justify-between rounded-md px-5 py-2 lg:text-lg font-bold
                                text-[var(--color-text)] hover:text-[var(--color-brand)]
                              "
                              role="menuitem"
                            >
                              <span>{c.name}</span>
                              <span className="text-xs text-[var(--color-text)]">{c.count}</span>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="px-5 py-2 text-xs text-[var(--color-text)]">
                          카테고리 없음
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </li>

            {/* Blogs hover */}
            <li className="relative group">
              <Link
                href="/blogs"
                className={linkCls("/blogs", { startsWith: true })}
                aria-current={isActive("/blogs", { startsWith: true }) ? "page" : undefined}
                aria-haspopup="true"
                aria-expanded="false"
              >
                Blogs
              </Link>
              <div
                className="
                  pointer-events-none absolute left-1/2 top-full -translate-x-1/2
                  pt-6 opacity-0 transition-opacity duration-150
                  group-hover:opacity-100 group-hover:pointer-events-auto
                "
                role="menu"
                aria-label="Blog categories"
              >
                <div className="min-w-52 lg:min-w-64 rounded-xl lg:rounded-2xl border-2 border-[var(--color-line)] bg-[var(--color-panel)] p-2">
                  {loading && (
                    <div className="px-2 py-2 text-xs text-[var(--color-text)]">불러오는 중…</div>
                  )}

                  {!loading && (
                    <ul className="max-h-64 lg:max-h-72 overflow-auto">
                      {/* All Blogs */}
                      <li>
                        <Link
                          href="/blogs"
                          className="
                            flex items-center justify-between rounded-md px-5 py-2 lg:text-lg font-bold
                            text-[var(--color-text)] hover:text-[var(--color-brand)]
                          "
                          role="menuitem"
                        >
                          <span>All Blogs</span>
                          <span className="text-xs text-[var(--color-text)]">{totalBlog}</span>
                        </Link>
                      </li>

                      {/* 카테고리들 */}
                      {blogCats && blogCats.length > 0 ? (
                        blogCats.map((c) => (
                          <li key={c.name}>
                            <Link
                              href={`/blogs/${encodeURIComponent(c.name)}`}
                              className="
                                flex items-center justify-between rounded-md px-5 py-2 lg:text-lg font-bold
                                text-[var(--color-text)] hover:text-[var(--color-brand)]
                              "
                              role="menuitem"
                            >
                              <span>{c.name}</span>
                              <span className="text-xs text-[var(--color-text)]">{c.count}</span>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="px-5 py-2 text-xs text-[var(--color-text)]">
                          카테고리 없음
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </li>

            {/* Support hover */}
            <li className="relative group">
              <span
                role="button"
                tabIndex={0}
                className={`${linkCls("/support")} cursor-pointer select-none`}
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls="support-popover"
              >
                Support
              </span>

              <div
                id="support-popover"
                className="
                  absolute top-full right-0 z-50
                  opacity-0 translate-y-0
                  transition-[opacity] duration-150
                  pointer-events-none
                  group-hover:opacity-100 group-hover:pointer-events-auto
                  group-focus-within:opacity-100 group-focus-within:pointer-events-auto
                "
                role="dialog"
                aria-label="Support panel"
              >
                <div className="pt-3 md:pt-4 lg:pt-5">
                  <SupportPanel />
                </div>
              </div>
            </li>
          </ul>
        </nav>

        {/* 모바일 햄버거 (md 미만) */}
        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={openSidebar}
          className="p-2 -m-2 md:hidden hover:cursor-pointer"
        >
          <ThemedIcon
            alt="메뉴"
            width={24}
            height={24}
            light={{
              base: "/images/light/icon-menu.svg",
              hover: "/images/light/icon-menu-focus.svg",
              focus: "/images/light/icon-menu-focus.svg",
            }}
            dark={{
              base: "/images/dark/icon-menu.svg",
              hover: "/images/dark/icon-menu-focus.svg",
              focus: "/images/dark/icon-menu-focus.svg",
            }}
          />
        </button>
      </div>
    </header>
  );
}
