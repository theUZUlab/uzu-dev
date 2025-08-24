import type { Post } from "@/lib/types";

export interface ListResponse<T = Post> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

const isServer = typeof window === "undefined";

const SERVER_BASE = (process.env.BACKEND_BASE || "").replace(/\/$/, "");
const CLIENT_BASE = (process.env.NEXT_PUBLIC_API_BASE || "/api").replace(/\/$/, "") + "/backend";

function ensureServerBase() {
  if (!SERVER_BASE) {
    throw new Error(
      "BACKEND_BASE is not set. Please set BACKEND_BASE in env (e.g. https://uzu-dev.onrender.com)"
    );
  }
}

// 경로+쿼리 → 최종 URL 문자열
function buildUrl(path: string, qs?: Record<string, string | number | undefined>) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const sp = new URLSearchParams();
  if (qs) {
    for (const [k, v] of Object.entries(qs)) {
      if (v === undefined || v === null) continue;
      sp.set(k, String(v));
    }
  }
  const q = sp.toString();

  if (isServer) {
    ensureServerBase();
    return q ? `${SERVER_BASE}${p}?${q}` : `${SERVER_BASE}${p}`;
  }
  return q ? `${CLIENT_BASE}${p}?${q}` : `${CLIENT_BASE}${p}`;
}

// 공통 GET(JSON) — 서버에선 revalidate 사용
async function getJSON<T>(url: string, revalidateSec = 60): Promise<T> {
  const res = await fetch(url, isServer ? { next: { revalidate: revalidateSec } } : {});
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} -> ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

//  응답 타입 유틸 (백엔드가 items 또는 data를 줄 수 있음)
type BackendList<T> =
  | { items: T[]; page?: number; limit?: number; total?: number }
  | { data: T[]; page?: number; limit?: number; total?: number };

type BackendItem<T> = T | { data: T };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasItems<T>(raw: unknown): raw is { items: T[] } {
  if (!isObject(raw)) return false;
  return Array.isArray(raw.items);
}

function hasDataArray<T>(raw: unknown): raw is { data: T[] } {
  if (!isObject(raw)) return false;
  return Array.isArray(raw.data);
}

function hasDataObject<T>(raw: unknown): raw is { data: T } {
  if (!isObject(raw)) return false;
  return "data" in raw && !Array.isArray((raw as Record<string, unknown>).data);
}

// 안전 숫자 추출
function readNumber(obj: Record<string, unknown>, key: string, fallback: number): number {
  const v = obj[key];
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

// 목록 응답 정규화: items | data 둘 중 무엇이든 items로 맞춤
function normalizeList<T>(raw: BackendList<T>): ListResponse<T> {
  let items: T[] = [];
  if (hasItems<T>(raw)) items = raw.items;
  else if (hasDataArray<T>(raw)) items = raw.data;

  const meta = isObject(raw) ? (raw as Record<string, unknown>) : {};
  const page = readNumber(meta, "page", 1);
  const limit = readNumber(meta, "limit", items.length || 0);
  const total = readNumber(meta, "total", items.length || 0);

  return { items, page, limit, total };
}

// 단건 응답 정규화: T | {data:T} → T
function normalizeItem<T>(raw: BackendItem<T>): T {
  if (hasDataObject<T>(raw)) {
    const obj = raw as Record<string, unknown>;
    return obj.data as T;
  }
  return raw as T;
}

/* =========================
   Projects
========================= */
// 프로젝트 목록
export async function listProjects(params?: {
  q?: string;
  page?: number;
  limit?: number;
  category?: string;
  tags?: string[]; // OR 조건: 콤마로 조인해 전달
  revalidateSec?: number;
}) {
  const url = buildUrl("/api/posts", {
    type: "project",
    q: params?.q,
    page: params?.page ?? 1,
    limit: params?.limit ?? 20,
    category: params?.category,
    tags: params?.tags?.length ? params.tags.join(",") : undefined,
  });

  const raw = await getJSON<BackendList<Post>>(url, params?.revalidateSec ?? 60);
  return normalizeList<Post>(raw);
}

// 개별 프로젝트 조회
export async function getProjectById(id: string, opts?: { revalidateSec?: number }) {
  const safeId = encodeURIComponent(id);
  const url = buildUrl(`/api/posts/${safeId}`);
  const raw = await getJSON<BackendItem<Post>>(url, opts?.revalidateSec ?? 60);
  return normalizeItem<Post>(raw);
}

/* =========================
   Blogs
========================= */
// 블로그 목록
export async function listBlogs(params?: {
  q?: string;
  page?: number;
  limit?: number;
  category?: string;
  tags?: string[]; // OR 조건: 콤마로 조인해 전달
  revalidateSec?: number;
}) {
  const url = buildUrl("/api/posts", {
    type: "blog",
    q: params?.q,
    page: params?.page ?? 1,
    limit: params?.limit ?? 20,
    category: params?.category,
    tags: params?.tags?.length ? params.tags.join(",") : undefined,
  });

  const raw = await getJSON<BackendList<Post>>(url, params?.revalidateSec ?? 60);
  return normalizeList<Post>(raw);
}

// 개별 블로그 조회 (필요 시)
export async function getBlogById(id: string, opts?: { revalidateSec?: number }) {
  const safeId = encodeURIComponent(id);
  const url = buildUrl(`/api/posts/${safeId}`);
  const raw = await getJSON<BackendItem<Post>>(url, opts?.revalidateSec ?? 60);
  return normalizeItem<Post>(raw);
}
