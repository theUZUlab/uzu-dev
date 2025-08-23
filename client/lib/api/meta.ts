export type CategoryStat = { name: string; count: number };

export type PostLite = {
  type?: "project" | "blog";
  category?: string | null;
};

type ListResp = {
  data?: PostLite[];
  page?: number;
  limit?: number;
  total?: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

/** 공통 GET(JSON) */
async function getJSON<T>(url: string, revalidateSec = 60): Promise<T> {
  const res = await fetch(url, { next: { revalidate: revalidateSec } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} -> ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

/** 내부 유틸: 쿼리 문자열로만 안전 조합 (new URL 사용 안 함) */
function buildUrl(path: string, qs: Record<string, string | number | undefined>): string {
  const base = API_BASE.replace(/\/+$/, ""); // 끝의 / 제거
  const p = path.startsWith("/") ? path : `/${path}`;
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(qs)) {
    if (v === undefined) continue;
    sp.set(k, String(v));
  }
  const q = sp.toString();
  return q ? `${base}${p}?${q}` : `${base}${p}`;
}

/** 카테고리 목록 수집 (페이지 1만, 백엔드가 정렬/필터 지원하므로 충분) */
export async function listCategories(
  type: "project" | "blog",
  opts?: { limit?: number; revalidateSec?: number }
): Promise<CategoryStat[]> {
  const limit = Math.max(1, Math.min(opts?.limit ?? 100, 200));

  // /api/backend/api/posts?type=...&page=1&limit=...
  const url = buildUrl("/backend/api/posts", {
    type,
    page: 1,
    limit,
  });

  const resp = await getJSON<ListResp>(url, opts?.revalidateSec ?? 60);

  const rows = Array.isArray(resp.data) ? resp.data : [];

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

export type TagStat = { name: string; count: number };

export async function listTags(
  type: "project" | "blog",
  opts?: { limit?: number; revalidateSec?: number }
): Promise<TagStat[]> {
  const limit = Math.max(1, Math.min(opts?.limit ?? 100, 200));
  const url = buildUrl("/backend/api/posts", { type, page: 1, limit });
  const resp = await getJSON<{ data?: Array<{ tags?: string[] | null }> }>(
    url,
    opts?.revalidateSec ?? 60
  );

  const rows = Array.isArray(resp.data) ? resp.data : [];

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
