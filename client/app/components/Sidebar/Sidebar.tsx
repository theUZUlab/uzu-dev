"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

import Accordion from "../Ui/Accordion/Accordion";
import ThemedIcon from "@/app/components/Ui/ThemedIcon";
import SupportPanelCompact from "@/app/components/Support/SupportPanelCompact";

import { useSidebar } from "./SidebarContext";
import { useNavData } from "./NavDataContext";

export default function Sidebar() {
  const { open, closeSidebar } = useSidebar();
  const { projCats, blogCats, loading } = useNavData();
  const pathname = usePathname();

  const linkColor = useCallback(
    (target: string, { startsWith = false } = {}) => {
      const active = startsWith ? pathname.startsWith(target) : pathname === target;
      return active
        ? "text-[var(--color-brand)] hover:text-[var(--color-brand)]"
        : "text-[var(--color-text)] hover:text-[var(--color-brand)]";
    },
    [pathname]
  );

  const totalProj = useMemo(() => (projCats ?? []).reduce((acc, c) => acc + c.count, 0), [projCats]);
  const totalBlog = useMemo(() => (blogCats ?? []).reduce((acc, c) => acc + c.count, 0), [blogCats]);

  const asideId = "app-sidebar";

  return (
    <>
      {/* overlay */}
      <div
        role="presentation"
        aria-hidden={!open}
        tabIndex={-1}
        onClick={closeSidebar}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* panel */}
      <aside
        id={asideId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${asideId}-title`}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col",
          "bg-[var(--color-bg)] transition-transform duration-200 will-change-transform",
          "w-[80%] max-w-[320px] px-4 py-6",
          "md:w-[60%] md:max-w-[360px] md:px-6 md:py-7",
          "lg:w-[420px] lg:max-w-[420px] lg:px-8",
          "2xl:w-[480px] 2xl:max-w-[480px] 2xl:px-10",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <h2 id={`${asideId}-title`} className="sr-only">
          사이드바 메뉴
        </h2>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="메뉴 닫기"
            className="p-2 -m-2 hover:cursor-pointer pb-4"
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

        <nav aria-label="사이드바 메뉴">
          <ul className="grid gap-3">
            {/* Home */}
            <li className="leading-none">
              <Link
                href="/"
                onClick={closeSidebar}
                className={cn("inline-flex items-center leading-none py-2 text-lg lg:text-xl font-black", linkColor("/"))}
                aria-current={pathname === "/" ? "page" : undefined}
              >
                Home
              </Link>
            </li>

            {/* Projects */}
            <li className="leading-none">
              <Accordion
                title={
                  <span
                    className={cn("inline-flex items-center leading-none text-lg lg:text-xl font-black", linkColor("/projects", { startsWith: true }))}
                    aria-current={pathname.startsWith("/projects") ? "page" : undefined}
                  >
                    Projects
                  </span>
                }
              >
                {loading && <div className="text-xs text-[var(--color-text)]">불러오는 중…</div>}

                {!loading && (
                  <ul className="grid gap-1">
                    <li>
                      <Link
                        href="/projects"
                        onClick={closeSidebar}
                        className={cn("flex items-center justify-between px-3 py-1 text-sm font-semibold", linkColor("/projects", { startsWith: true }))}
                        aria-current={pathname.startsWith("/projects") ? "page" : undefined}
                      >
                        <span>All Projects</span>
                        <span className="text-xs text-[var(--color-text)]">{totalProj}</span>
                      </Link>
                    </li>
                    {projCats && projCats.length > 0 ? (
                      projCats.map((c) => {
                        const href = `/projects/${encodeURIComponent(c.name)}`;
                        return (
                          <li key={c.name}>
                            <Link
                              href={href}
                              onClick={closeSidebar}
                              className={cn("flex items-center justify-between px-3 py-1 text-sm font-semibold", linkColor(href))}
                              aria-current={pathname === href ? "page" : undefined}
                            >
                              <span>{c.name}</span>
                              <span className="text-xs text-[var(--color-text)]">{c.count}</span>
                            </Link>
                          </li>
                        );
                      })
                    ) : (
                      <li className="px-3 py-1 text-xs text-[var(--color-text)]">카테고리 없음</li>
                    )}
                  </ul>
                )}
              </Accordion>
            </li>

            {/* Blogs */}
            <li className="leading-none">
              <Accordion
                title={
                  <span
                    className={cn("inline-flex items-center leading-none text-lg lg:text-xl font-black", linkColor("/blogs", { startsWith: true }))}
                    aria-current={pathname.startsWith("/blogs") ? "page" : undefined}
                  >
                    Blogs
                  </span>
                }
              >
                {loading && <div className="text-xs text-[var(--color-text)]">불러오는 중…</div>}
                {!loading && (
                  <ul className="grid gap-1">
                    <li>
                      <Link
                        href="/blogs"
                        onClick={closeSidebar}
                        className={cn("flex items-center justify-between px-3 py-1 text-sm font-semibold", linkColor("/blogs", { startsWith: true }))}
                        aria-current={pathname.startsWith("/blogs") ? "page" : undefined}
                      >
                        <span>All Blogs</span>
                        <span className="text-xs text-[var(--color-text)]">{totalBlog}</span>
                      </Link>
                    </li>
                    {blogCats && blogCats.length > 0 ? (
                      blogCats.map((c) => {
                        const href = `/blogs/${encodeURIComponent(c.name)}`;
                        return (
                          <li key={c.name}>
                            <Link
                              href={href}
                              onClick={closeSidebar}
                              className={cn("flex items-center justify-between px-3 py-1 text-sm font-semibold", linkColor(href))}
                              aria-current={pathname === href ? "page" : undefined}
                            >
                              <span>{c.name}</span>
                              <span className="text-xs text-[var(--color-text)]">{c.count}</span>
                            </Link>
                          </li>
                        );
                      })
                    ) : (
                      <li className="px-3 py-1 text-xs text-[var(--color-text)]">카테고리 없음</li>
                    )}
                  </ul>
                )}
              </Accordion>
            </li>

            {/* Support */}
            <li className="leading-none">
              <Accordion
                title={
                  <span
                    className={cn("inline-flex items-center leading-none text-lg lg:text-xl font-black cursor-pointer", linkColor("/support"))}
                    aria-current={pathname === "/support" ? "page" : undefined}
                  >
                    Support
                  </span>
                }
              >
                <SupportPanelCompact />
              </Accordion>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
