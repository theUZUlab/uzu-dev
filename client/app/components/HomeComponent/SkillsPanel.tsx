"use client";

import TagCard from "./TagCard";

type SkillRow = { title: string; items: string[] };

const SKILLS_DATA: SkillRow[] = [
  { title: "Languages", items: ["JavaScript", "TypeScript", "Python"] },
  { title: "Frontend", items: ["Next.js", "React", "TailwindCSS"] },
  { title: "Backend", items: ["Node.js", "Express", "NestJS (planning)"] },
  { title: "Database", items: ["MongoDB", "PostgreSQL (learning)"] },
  { title: "Tools", items: ["Git", "GitHub Actions", "Vercel / Render", "Figma"] },
];

export default function SkillsPanel() {
  return (
    <div className="divide-y-2 divide-[var(--color-line)]">
      {SKILLS_DATA.map((row) => (
        <details
          key={row.title}
          className="
            group
            px-3.5 py-3.5 md:px-7 md:py-4 lg:px-10 lg:py-7
          "
        >
          {/* 1) summary는 첫 자식이어야 함 */}
          <summary
            className="
              flex cursor-pointer items-center
              hover:text-[var(--color-brand)]
              group-open:text-[var(--color-brand)]
              /* 3) 기본 마커 숨김 */
              [&::-webkit-details-marker]:hidden
              [&::marker]:hidden
            "
          >
            <span className="text-base md:text-lg font-black">{row.title}</span>

            {/* 삼각형 아이콘 */}
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="
                ml-1
                h-2.5 w-2.5
                md:h-3 md:w-3
                lg:h-3.5 lg:w-3.5
                transition-transform duration-200
                group-open:rotate-180
              "
            >
              <polygon
                points="12,17 5,7 19,7"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </summary>

          {/* 2) 간격은 여기서 mt로 제어 */}
          <div className="mt-2 md:mt-3">
            <div className="flex flex-wrap gap-1 md:gap-1.5 lg:gap-2">
              {row.items.map((it) => (
                <TagCard key={it}>{it}</TagCard>
              ))}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
