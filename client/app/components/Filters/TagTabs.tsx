"use client";

import { useEffect, useMemo, useState, MouseEvent } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { listTags, TagStat } from "@/lib/api/meta";
import { listProjects, listBlogs } from "@/lib/api/posts";

export default function TagTabs({
  type = "project",
  category,
}: {
  type?: "project" | "blog";
  category?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [tags, setTags] = useState<TagStat[]>([]);
  const [loading, setLoading] = useState(true);

  const selected = useMemo(
    () =>
      sp
        .get("tags")
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? [],
    [sp]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);

      if (category) {
        // ✅ 카테고리별 태그 집계 시, type에 따라 projects / blogs 분기
        const res =
          type === "project"
            ? await listProjects({ page: 1, limit: 500, category })
            : await listBlogs({ page: 1, limit: 500, category });

        const items = Array.isArray(res?.items) ? res.items : [];
        const counts = new Map<string, number>();

        for (const p of items) {
          if (!Array.isArray(p.tags)) continue;
          for (const t of p.tags) {
            const name = (t || "").toString().trim();
            if (!name) continue;
            counts.set(name, (counts.get(name) ?? 0) + 1);
          }
        }

        const list = Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        if (alive) setTags(list);
      } else {
        // 전체 태그는 백엔드 메타 API 사용
        const data = await listTags(type, { limit: 200 });
        if (alive) setTags(data);
      }

      if (alive) setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, [type, category]);

  const apply = (next: string[]) => {
    const params = new URLSearchParams(sp.toString());
    if (next.length) params.set("tags", next.join(","));
    else params.delete("tags");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const onClickTag = (name: string, e: MouseEvent<HTMLButtonElement>) => {
    const multi = e.ctrlKey || e.metaKey;
    const curr = new Set(selected);

    if (multi) {
      if (curr.has(name)) curr.delete(name);
      else curr.add(name);
      apply(Array.from(curr));
      return;
    }

    if (selected.length === 1 && selected[0] === name) {
      apply([]);
    } else {
      apply([name]);
    }
  };

  const clearAll = () => apply([]);

  const btnInnerCls =
    "aurora-inner px-3 py-1 md:px:4 lg:px-5 hover:cursor-pointer rounded-[var(--radius-md)] text-sm md:text-base lg:text-lg font-bold whitespace-nowrap flex items-center";

  return (
    <div
      className="
        mt-3 w-full
        flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide x-scroll
        snap-x snap-mandatory
        md:flex-wrap md:overflow-visible md:snap-none
      "
      role="tablist"
      aria-label="태그 필터"
    >
      <button
        type="button"
        onClick={clearAll}
        className="aurora-frame hover:cursor-pointer rounded-[var(--radius-md)] p-0.5 shrink-0 snap-start"
      >
        <span
          className={`${btnInnerCls} ${
            selected.length === 0
              ? "bg-[var(--color-brand)] text-[var(--color-text)]"
              : "bg-[var(--color-panel)] text-[var(--color-text)]"
          }`}
        >
          All
        </span>
      </button>

      {loading ? (
        <span className="text-xs text-[var(--color-text)] shrink-0">Loading…</span>
      ) : tags.length === 0 ? (
        <span className="text-xs text-[var(--color-text)] shrink-0">태그 없음</span>
      ) : (
        tags.map((t) => {
          const active = selected.includes(t.name);
          return (
            <button
              key={t.name}
              type="button"
              onClick={(e) => onClickTag(t.name, e)}
              className="aurora-frame hover:cursor-pointer rounded-[var(--radius-md)] p-0.5 shrink-0 snap-start"
            >
              <span
                className={`${btnInnerCls} ${
                  active
                    ? "bg-[var(--color-brand)] text-[var(--color-text)]"
                    : "bg-[var(--color-panel)] text-[var(--color-text)]"
                }`}
              >
                {t.name}
                <span className="ml-1 md:ml-1.5 lg:ml-2 opacity-70 font-semibold text-xs">
                  {t.count}
                </span>
              </span>
            </button>
          );
        })
      )}
    </div>
  );
}
