const API_BASE = (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "") + "/backend";

type Json = Record<string, unknown> | unknown[];

async function getJSON<T>(url: string, revalidateSec = 60): Promise<T> {
  const res = await fetch(url, { next: { revalidate: revalidateSec } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} -> ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

/** 쿼리 문자열 유틸 */
function buildUrl(path: string, qs?: Record<string, string | number | undefined>) {
  const base = API_BASE.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  const search = new URLSearchParams();
  if (qs) {
    Object.entries(qs).forEach(([k, v]) => {
      if (v !== undefined && v !== null) search.set(k, String(v));
    });
  }
  const q = search.toString();
  return `${base}${p}${q ? `?${q}` : ""}`;
}

/** 공통 목록 가져오기 */
export async function listPosts(params: {
  type?: "project" | "blog";
  q?: string;
  page?: number;
  limit?: number;
  revalidateSec?: number;
}) {
  const url = buildUrl("/api/posts", {
    type: params.type,
    q: params.q,
    page: params.page,
    limit: params.limit,
  });
  return getJSON<Json>(url, params.revalidateSec ?? 60);
}

export { getJSON, buildUrl, API_BASE };
