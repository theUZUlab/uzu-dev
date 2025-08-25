"use client";

import GhostButton from "./GhostButton";

import type { Post } from "@/lib/types";

export default function RecentProjectsList({ items }: { items: Post[] }) {
  if (!items.length) {
    return (
      <p className="px-3.5 py-3.5 md:px-7 md:py-4 lg:px-10 lg:py-7 text-sm opacity-80">
        No projects to display yet.
      </p>
    );
  }
  return (
    <div className="divide-y-2 divide-[var(--color-line)]">
      {items.map((p) => (
        <article key={p.id} className="px-3.5 py-3.5 md:px-7 md:py-4 lg:px-10 lg:py-7">
          <h4 className="text-base md:text-lg font-black">{p.title}</h4>
          {p.summary && <p className="text-sm md:text-base line-clamp-1">{p.summary}</p>}
          <div className="mt-3 md:mt-5 grid grid-cols-2 gap-1.5 md:gap-2 lg:gap-2.5 w-full">
            <GhostButton href={p.deployUrl}>View</GhostButton>
            <GhostButton href={p.repoUrl}>Repo</GhostButton>
          </div>
        </article>
      ))}
    </div>
  );
}
