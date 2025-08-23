export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  return (
    <main className="container py-6">
      블로그 상세: {category} / {slug}
    </main>
  );
}
