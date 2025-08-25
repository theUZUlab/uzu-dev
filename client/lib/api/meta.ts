import { buildUrl, getJSON } from "@/lib/http";
import type { CategoryStat, TagStat, PostLite } from "@/lib/types";

/** 백엔드 목록 응답 (메타용) */
type ListResp = {
  data?: PostLite[];
  page?: number;
  limit?: number;
  total?: number;
};

/** 카테고리 목록 수집 */
export async function listCategories(
  type: "project" | "blog",
  opts?: { limit?: number; revalidateSec?: number }
): Promise<CategoryStat[]> {
  const limit = Math.max(1, Math.min(opts?.limit ?? 100, 200));

  // 백엔드: /api/posts
  const url = buildUrl("/api/posts", { type, page: 1, limit });

  const resp = await getJSON<ListResp>(url, opts?.revalidateSec ?? 60);
  const rows = Array.isArray(resp?.data) ? resp.data : [];

  const counts = new Map<string, number>();
  for (const row of rows) {
    const raw = (row.category ?? "").toString().trim();
    if (!raw) continue;
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }

  return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

/** 태그 집계 */
export async function listTags(
  type: "project" | "blog",
  opts?: { limit?: number; revalidateSec?: number }
): Promise<TagStat[]> {
  const limit = Math.max(1, Math.min(opts?.limit ?? 100, 200));
  const url = buildUrl("/api/posts", { type, page: 1, limit });

  const resp = await getJSON<{ data?: Array<{ tags?: string[] | null }> }>(
    url,
    opts?.revalidateSec ?? 60
  );

  const rows = Array.isArray(resp?.data) ? resp.data : [];

  const counts = new Map<string, number>();
  for (const row of rows) {
    const tags = Array.isArray(row.tags) ? row.tags : [];
    for (const t of tags) {
      const name = (t ?? "").toString().trim();
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }

  return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
