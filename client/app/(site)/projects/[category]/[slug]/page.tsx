export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  return (
    <main className="container py-6">
      프로젝트 상세: {category} / {slug}
    </main>
  );
}
