"use client";

import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { listTags } from "@/lib/api/meta";
import { TagStat } from "@/lib/types";

const TAG_TTL = 5 * 60 * 1000;
const tagCache = new Map<string, { data: TagStat[]; ts: number }>();

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

  const [tags, setTags] = useState<TagStat[]>(() => {
    const key = `${type}:${category ?? ""}`;
    const c = tagCache.get(key);
    return c && Date.now() - c.ts <= TAG_TTL ? c.data : [];
  });
  const [loading, setLoading] = useState(() => {
    const key = `${type}:${category ?? ""}`;
    const c = tagCache.get(key);
    return !(c && Date.now() - c.ts <= TAG_TTL);
  });

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
    const cacheKey = `${type}:${category ?? ""}`;
    const cached = tagCache.get(cacheKey);
    if (cached && Date.now() - cached.ts <= TAG_TTL) {
      setTags(cached.data);
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const list = await listTags(type, { category, limit: 200 });
        if (!alive) return;
        tagCache.set(cacheKey, { data: list, ts: Date.now() });
        setTags(list);
      } catch (e) {
        console.warn("[TagTabs] 태그 로드 실패:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [type, category]);

  const apply = useCallback(
    (next: string[]) => {
      const params = new URLSearchParams(sp.toString());
      if (next.length) params.set("tags", next.join(","));
      else params.delete("tags");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [sp, router, pathname]
  );

  const onClickTag = useCallback(
    (name: string, e: MouseEvent<HTMLButtonElement>) => {
      const multi = e.ctrlKey || e.metaKey;
      const curr = new Set(selected);
      if (multi) {
        if (curr.has(name)) curr.delete(name);
        else curr.add(name);
        apply(Array.from(curr));
        return;
      }
      if (selected.length === 1 && selected[0] === name) apply([]);
      else apply([name]);
    },
    [selected, apply]
  );

  const clearAll = useCallback(() => apply([]), [apply]);

  const btnInnerCls =
    "aurora-inner px-3 py-1 md:px-4 lg:px-5 hover:cursor-pointer rounded-[var(--radius-md)] text-sm md:text-base lg:text-lg font-bold whitespace-nowrap flex items-center";

  if (loading) {
    return (
      <div className="mt-3 flex flex-nowrap gap-2 overflow-x-auto md:flex-wrap" aria-busy="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 rounded-[var(--radius-md)] bg-[var(--color-line)] animate-pulse shrink-0"
            style={{ width: `${60 + i * 12}px` }}
          />
        ))}
      </div>
    );
  }

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
          className={cn(btnInnerCls, selected.length === 0 ? "bg-[var(--color-brand)]" : "bg-[var(--color-panel)]", "text-[var(--color-text)]")}
        >
          All
        </span>
      </button>

      {tags.map((t) => {
        const active = selected.includes(t.name);
        return (
          <button
            key={t.name}
            type="button"
            onClick={(e) => onClickTag(t.name, e)}
            className="aurora-frame hover:cursor-pointer rounded-[var(--radius-md)] p-0.5 shrink-0 snap-start"
          >
            <span
              className={cn(btnInnerCls, active ? "bg-[var(--color-brand)]" : "bg-[var(--color-panel)]", "text-[var(--color-text)]")}
            >
              {t.name}
              <span className="ml-1 md:ml-1.5 lg:ml-2 opacity-70 font-semibold text-xs">
                {t.count}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
