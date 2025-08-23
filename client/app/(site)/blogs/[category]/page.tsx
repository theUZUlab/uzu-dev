export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return <main className="container py-6">블로그 카테고리: {category}</main>;
}
