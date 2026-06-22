export const dynamic = "force-dynamic";
import Link from "next/link";
import { listProjects } from "@/lib/api/posts";

import ThemedImage from "@/app/components/Ui/ThemedImage";
import RecentProjectsList from "../components/Home/RecentProjectsList";
import SectionCard from "../components/Ui/SectionCard";
import SkillsPanel from "../components/Home/SkillsPanel";

import type { Post } from "@/lib/types";

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
  const { items } = await listProjects({ page: 1, limit: 50, revalidateSec: 60 });
  const recent = (items || []).sort(sortByRecent).slice(0, 3);

  return (
    <main
      className="mx-auto max-w-screen-2xl 2xl:max-w-[1440px] px-4 lg:px-8 2xl:px-10"
      aria-labelledby="home-title"
    >
      {/* a11y용 제목 (시각적으로 숨김) */}
      <h3 id="home-title" className="sr-only">
        UZU Home
      </h3>

      {/* HERO */}
      <section className="py-5 md:py-24">
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-10 lg:gap-20">
          <div className="relative aspect-square w-[120px] md:w-[300px] lg:w-[350px] rounded-full overflow-hidden border-2 border-[var(--color-line)]">
            <ThemedImage {...heroImageProps} priority />
          </div>

          <div className="text-center md:text-left w-full md:w-[600px] lg:w-[900px]">
            <p className="text-xl md:text-3xl font-black tracking-tight">Hello, I’m Yuju Jang</p>
            <p className="my-3 lg:my-6 text-sm md:text-base font-semibold leading-6 md:leading-7">
              I am pursuing a degree in Artificial Intelligence at Cheju Halla University. While my
              current focus is on frontend development, I am progressively expanding my expertise
              into backend and AI development.
            </p>
            <div className="relative inline-block rounded-md p-0.5 aurora-frame transition-colors">
              <Link
                href="/projects"
                className="
                  block rounded-md aurora-inner
                  px-20 py-2
                  text-sm md:text-base lg:text-lg font-bold
                "
                aria-label="프로젝트 목록 보기"
              >
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* My Skills */}
      <SectionCard title="My Skills" id="skills">
        <SkillsPanel />
      </SectionCard>

      {/* Recent Projects */}
      <SectionCard title="Recent Projects" id="recent-projects">
        <RecentProjectsList items={recent} />
      </SectionCard>

      {/* Growth Log */}
      <SectionCard title="Growth Log" id="growth-log">
        <div className="px-3.5 py-3.5 md:px-7 md:py-4 lg:px-10 lg:py-7">
          <p className="text-base md:text-lg font-black">
            Sharing my learning journey and development insights
          </p>
          <div className="mt-2">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1 text-sm md:text-base font-semibold hover:text-[var(--color-brand)]"
              aria-label="블로그 더 보기"
            >
              Read More <span aria-hidden>&gt;</span>
            </Link>
          </div>
        </div>
      </SectionCard>
    </main>
  );
}
