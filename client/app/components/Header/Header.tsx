// app/(site)/page.tsx
import Link from "next/link";

import { listProjects } from "@/lib/api/posts";
import ThemedImage from "../Ui/ThemedImage";
import RecentProjectsList from "../Home/RecentProjectsList";
import SectionCard from "../Ui/SectionCard";
import SkillsPanel from "../Home/SkillsPanel";

import type { Post } from "@/lib/types";

// ✅ 빌드 시 프리렌더 금지 + 캐시 금지
export const dynamic = "force-dynamic";
export const revalidate = 0;

const heroImageProps = {
  alt: "Hero Image",
  lightSrc: "/images/light/img-hero.png",
  darkSrc: "/images/dark/img-hero.png",
} as const;

function toTime(s?: string | null) {
  if (!s) return 0;
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : 0;
}
function sortByRecent(a: Post, b: Post) {
  const aT = toTime(a.date) || toTime(a.updatedAt) || toTime(a.createdAt);
  const bT = toTime(b.date) || toTime(b.updatedAt) || toTime(b.createdAt);
  return bT - aT;
}

export default async function SiteHomePage() {
  // ✅ 백엔드 오류/콜드스타트 시 빌드·런타임 모두 안전하게 폴백
  let items: Post[] = [];
  try {
    const res = await listProjects({ page: 1, limit: 50, revalidateSec: 0 });
    items = Array.isArray(res.items) ? res.items : [];
  } catch {
    items = [];
  }

  const recent = items.sort(sortByRecent).slice(0, 3);

  return (
    <main
      className="mx-auto max-w-screen-2xl 2xl:max-w-[1440px] px-4 lg:px-8 2xl:px-10"
      aria-labelledby="home-title"
    >
      <h2 id="home-title" className="sr-only">UZU Home</h2>

      {/* HERO */}
      <section className="py-5 md:py-24">
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-10 lg:gap-20">
          <div className="relative aspect-square w-[120px] md:w-[300px] lg:w-[350px] rounded-full overflow-hidden border-2 border-[var(--color-line)]">
            <ThemedImage {...heroImageProps} priority />
          </div>

          <div className="text-center md:text-left w-full md:w-[600px] lg:w-[900px]">
            <p className=" text-xl md:text-3xl font-black tracking-tight">Hello, I’m Yuju Jang</p>
            <p className="my-3 lg:my-6 text-sm md:text-base font-semibold leading-6 md:leading-7">
              I am pursuing a degree in Artificial Intelligence at Cheju Halla University...
            </p>
            <div className="relative inline-block rounded-md p-0.5 aurora-frame transition-colors">
              <Link
                href="/projects"
                className="block rounded-md aurora-inner px-20 py-2 text-sm md:text-base lg:text-lg font-bold"
              >
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="My Skills" id="skills">
        <SkillsPanel />
      </SectionCard>

      <SectionCard title="Recent Projects" id="recent-projects">
        <RecentProjectsList items={recent} />
      </SectionCard>

      <SectionCard title="Growth Log" id="growth-log">
        <div className="px-3.5 py-3.5 md:px-7 md:py-4 lg:px-10 lg:py-7">
          <p className="text-base md:text-lg font-black">
            Sharing my learning journey and development insights
          </p>
          <div className="mt-2">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1 text-sm md:text-base font-semibold hover:text-[var(--color-brand)]"
            >
              Read More <span aria-hidden>&gt;</span>
            </Link>
          </div>
        </div>
      </SectionCard>
    </main>
  );
}
