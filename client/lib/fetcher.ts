import type { Post } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

/** 공통 GET(JSON) */
async function getJSON<T>(url: string, revalidateSec = 60): Promise<T> {
  const res = await fetch(url, { next: { revalidate: revalidateSec } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} -> ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

/** 목록 조회: /api/posts?q=&page=&limit=&type=&category=&tags= */
export async function listPosts(params: {
  q?: string;
  page?: number;
  limit?: number;
  type?: "project" | "blog";
  category?: string; // 예: "web" | "app"
  tags?: string[]; // ["머신러닝"] 처럼 단일/다중
  revalidateSec?: number;
}) {
  const u = new URL(`${API_BASE}/api/posts`);
  if (params.q) u.searchParams.set("q", params.q);
  if (params.page) u.searchParams.set("page", String(params.page));
  if (params.limit) u.searchParams.set("limit", String(params.limit));
  if (params.type) u.searchParams.set("type", params.type);
  if (params.category) u.searchParams.set("category", params.category);
  if (params.tags?.length) u.searchParams.set("tags", params.tags.join(","));

  return getJSON<{ data: Post[]; page: number; limit: number; total: number }>(
    u.toString(),
    params.revalidateSec ?? 60
  );
}

/** 단건 조회: /api/posts/:id (slug를 안 쓰면 id 기준) */
export async function getPost(id: string, revalidateSec = 300) {
  const url = `${API_BASE}/api/posts/${encodeURIComponent(id)}`;
  return getJSON<Post>(url, revalidateSec);
}
