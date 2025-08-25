"use client";

import { MouseEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { listBlogs, listProjects } from "@/lib/api/posts";
import { listTags } from "@/lib/api/meta";
import { TagStat } from "@/lib/types";

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
  const [_loading, _setLoading] = useState(true); // 경고 제거용(현재 UI에서 loading 미사용)

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
      _setLoading(true);

      if (category) {
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
        const data = await listTags(type, { limit: 200 });
        if (alive) setTags(data);
      }

      if (alive) _setLoading(false);
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

    if (selected.length === 1 && selected[0] === name) apply([]);
    else apply([name]);
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
      })}
    </div>
  );
}
