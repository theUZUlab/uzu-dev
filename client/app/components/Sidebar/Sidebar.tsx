"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Accordion from "@/app/components/Accordion/Accordion";
import { listCategories, CategoryStat } from "@/lib/api/meta";
import ThemedIcon from "@/app/components/Ui/ThemedIcon";

import { useSidebar } from "./SidebarContext";

export default function Sidebar() {
  const { open, closeSidebar } = useSidebar();
  const [projCats, setProjCats] = useState<CategoryStat[] | null>(null);
  const [blogCats, setBlogCats] = useState<CategoryStat[] | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const linkColor = (target: string, { startsWith = false } = {}) => {
    const active = startsWith ? pathname.startsWith(target) : pathname === target;
    return active
      ? "text-[var(--color-brand)] hover:text-[var(--color-brand)]"
      : "text-[color:var(--color-text)] hover:text-[var(--color-brand)]";
  };

  const totalProj = (projCats ?? []).reduce((acc, c) => acc + c.count, 0);
  const totalBlog = (blogCats ?? []).reduce((acc, c) => acc + c.count, 0);

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

  return (
    <>
      {/* overlay */}
      <div
        aria-hidden={!open}
        onClick={closeSidebar}
        className={[
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={[
          "fixed inset-y-0 right-0 z-50",
          "bg-[var(--color-bg)]",
          "transition-transform duration-200 will-change-transform",
          open ? "translate-x-0" : "translate-x-full",
          // base
          "w-[80%] max-w-[320px] px-4 py-6",
          // md 이상
          "md:w-[60%] md:max-w-[360px] md:px-6 md:py-7",
          // lg 이상
          "lg:w-[420px] lg:max-w-[420px] lg:px-8",
          // 2xl 이상
          "2xl:w-[480px] 2xl:max-w-[480px] 2xl:px-10",
          // layout
          "flex flex-col",
        ].join(" ")}
      >
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

        <nav className="grid gap-1" aria-label="사이드바 메뉴">
          {/* Home */}
          <Link
            href="/"
            onClick={closeSidebar}
            className={`py-2 text-lg lg:text-xl font-black ${linkColor("/")}`}
          >
            Home
          </Link>

          {/* Projects */}
          <Accordion
            title={
              <span
                className={`text-lg lg:text-xl font-black ${linkColor("/projects", {
                  startsWith: true,
                })}`}
              >
                Projects
              </span>
            }
          >
            {loading && <div className="text-xs text-[color:var(--color-text)]">불러오는 중…</div>}

            {!loading && (
              <ul className="grid gap-1">
                {/* All Projects */}
                <li>
                  <Link
                    href="/projects"
                    onClick={closeSidebar}
                    className={[
                      "flex items-center justify-between px-3 py-1 text-sm font-semibold",
                      linkColor("/projects", { startsWith: true }),
                    ].join(" ")}
                  >
                    <span>All Projects</span>
                    <span className="text-xs text-[color:var(--color-text)]">{totalProj}</span>
                  </Link>
                </li>

                {/* 카테고리 */}
                {projCats && projCats.length > 0 ? (
                  projCats.map((c) => (
                    <li key={c.name}>
                      <Link
                        href={{ pathname: "/projects", query: { category: c.name } }}
                        onClick={closeSidebar}
                        className={[
                          "flex items-center justify-between px-3 py-1 text-sm font-semibold",
                          linkColor("/projects", { startsWith: true }),
                        ].join(" ")}
                      >
                        <span>{c.name}</span>
                        <span className="text-xs text-[color:var(--color-text)]">{c.count}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-1 text-xs text-[color:var(--color-text)]">
                    카테고리 없음
                  </li>
                )}
              </ul>
            )}
          </Accordion>

          {/* Blogs */}
          <Accordion
            title={
              <span
                className={`text-lg lg:text-xl font-black ${linkColor("/blogs", {
                  startsWith: true,
                })}`}
              >
                Blogs
              </span>
            }
          >
            {loading && <div className="text-xs text-[color:var(--color-text)]">불러오는 중…</div>}

            {!loading && (
              <ul className="grid gap-1">
                {/* All Blogs */}
                <li>
                  <Link
                    href="/blogs"
                    onClick={closeSidebar}
                    className={[
                      "flex items-center justify-between px-3 py-1 text-sm font-semibold",
                      linkColor("/blogs", { startsWith: true }),
                    ].join(" ")}
                  >
                    <span>All Blogs</span>
                    <span className="text-xs text-[color:var(--color-text)]">{totalBlog}</span>
                  </Link>
                </li>

                {/* 카테고리 */}
                {blogCats && blogCats.length > 0 ? (
                  blogCats.map((c) => (
                    <li key={c.name}>
                      <Link
                        href={{ pathname: "/blogs", query: { category: c.name } }}
                        onClick={closeSidebar}
                        className={[
                          "flex items-center justify-between px-3 py-1 text-sm font-semibold",
                          linkColor("/blogs", { startsWith: true }),
                        ].join(" ")}
                      >
                        <span>{c.name}</span>
                        <span className="text-xs text-[color:var(--color-text)]">{c.count}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-1 text-xs text-[color:var(--color-text)]">
                    카테고리 없음
                  </li>
                )}
              </ul>
            )}
          </Accordion>

          {/* Support */}
          <Link
            href="/support"
            onClick={closeSidebar}
            className={`py-2 text-lg lg:text-xl font-black ${linkColor("/support")}`}
          >
            Support
          </Link>
        </nav>
      </aside>
    </>
  );
}
