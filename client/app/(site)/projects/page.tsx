import { listPosts } from "@/lib/fetcher";
import ProjectCard from "@/app/components/Cards/ProjectCard";
import Empty from "@/app/components/Ui/Empty";

export default async function Page(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await props.searchParams;
  const page = Number(sp?.page ?? 1) || 1;
  const category = typeof sp?.category === "string" ? sp.category : undefined;
  const tag = typeof sp?.tag === "string" ? sp.tag : undefined;

  // 1차 버전: tag 단일만 사용. (다중은 추후)
  const { data, total } = await listPosts({
    type: "project",
    page,
    limit: 12,
    category,
    tags: tag ? [tag] : undefined,
    revalidateSec: 30,
  });

  if (!data?.length) return <Empty text="등록된 프로젝트가 없습니다." />;

  return (
    <main>
      {/* TODO: CategorySwitch / TagTabs 자리 */}
      <section>
        {data.map((p) => (
          <ProjectCard key={p.id} post={p} />
        ))}
      </section>

      {/* TODO: Pagination 자리 (total 사용) */}
      <div>총 {total}건</div>
    </main>
  );
}
