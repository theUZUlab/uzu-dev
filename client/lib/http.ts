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
    throw new Error("BACKEND_BASE is not set. Please set BACKEND_BASE in env");
  }
}

/** 경로+쿼리 → 최종 URL 문자열 */
export function buildUrl(path: string, qs?: Record<string, string | number | undefined>) {
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

/** 공통 GET(JSON) — 서버에선 revalidate 사용 */
export async function getJSON<T>(url: string, revalidateSec = 60): Promise<T> {
  const init = isServer ? { next: { revalidate: revalidateSec } as const } : undefined;
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} -> ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

/* =========================
   정규화 유틸
========================= */

type UnknownRecord = Record<string, unknown>;

/** 서버가 반환할 수 있는 목록 응답 형태(둘 중 하나) */
export type BackendList<T> =
  | { items: T[]; page?: number; limit?: number; total?: number }
  | { data: T[]; page?: number; limit?: number; total?: number };

/** 서버가 반환할 수 있는 단건 응답 형태(둘 중 하나) */
export type BackendItem<T> = T | { data: T };

/** 좁히기 유틸 */
function isObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}
function hasArrayProp<T>(obj: unknown, key: "items" | "data"): obj is { [K in typeof key]: T[] } {
  return isObject(obj) && Array.isArray((obj as UnknownRecord)[key]);
}
function hasDataObject<T>(obj: unknown): obj is { data: T } {
  return isObject(obj) && "data" in obj && !Array.isArray((obj as UnknownRecord).data);
}
function readNumber(obj: UnknownRecord, key: string, fallback: number): number {
  const v = obj[key];
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

/** 목록 응답 정규화: items | data 둘 중 무엇이든 items로 맞춤 */
export function normalizeList<T>(raw: BackendList<T>): ListResponse<T> {
  let items: T[] = [];
  if (hasArrayProp<T>(raw, "items")) items = raw.items;
  else if (hasArrayProp<T>(raw, "data")) items = raw.data;

  const meta = isObject(raw) ? (raw as UnknownRecord) : {};
  const page = readNumber(meta, "page", 1);
  const limit = readNumber(meta, "limit", items.length || 0);
  const total = readNumber(meta, "total", items.length || 0);

  return { items, page, limit, total };
}

/** 단건 응답 정규화: T | {data:T} → T */
export function normalizeItem<T>(raw: BackendItem<T>): T {
  if (hasDataObject<T>(raw)) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}
