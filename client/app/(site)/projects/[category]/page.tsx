export default async function ProjectCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return <main className="container py-6">프로젝트 카테고리: {category}</main>;
}
