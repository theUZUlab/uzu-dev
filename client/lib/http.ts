import type { ListResponse } from "@/lib/types";

/** 런타임 환경 */
const isServer = typeof window === "undefined";

/** 베이스 URL 계산 */
const SERVER_BASE = (process.env.BACKEND_BASE || "").replace(/\/$/, "");
const CLIENT_BASE = (process.env.NEXT_PUBLIC_API_BASE || "/api").replace(/\/$/, "") + "/backend";

function ensureServerBase() {
  if (!SERVER_BASE) {
    throw new Error(
      "BACKEND_BASE is not set. Please set BACKEND_BASE (e.g. https://uzu-dev.onrender.com)"
    );
  }
}

/** 경로+쿼리 → URL 문자열 */
export function buildUrl(
  path: string,
  qs?: Record<string, string | number | boolean | undefined>
) {
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
  const init = isServer ? { next: { revalidate: revalidateSec } } : undefined;
  const res = await fetch(url, init as RequestInit);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} -> ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

/* ==========
   응답 형태
========== */

/** 백엔드가 줄 수 있는 "목록" 응답 케이스 */
export type BackendList<T> =
  | { items: T[]; page?: number; limit?: number; total?: number }
  | { data: T[]; page?: number; limit?: number; total?: number };

/** 백엔드가 줄 수 있는 "단건" 응답 케이스 */
export type BackendItem<T> = T | { data: T };

/** 안전체크 유틸 */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function hasArrayProp<T>(v: unknown, key: "items" | "data"): v is Record<typeof key, T[]> {
  return isRecord(v) && Array.isArray((v as Record<string, unknown>)[key]);
}
function hasDataObject<T>(v: unknown): v is { data: T } {
  return isRecord(v) && "data" in v && !Array.isArray((v as Record<string, unknown>).data);
}
function readNumber(obj: Record<string, unknown>, key: string, fallback: number): number {
  const val = obj[key];
  return typeof val === "number" && Number.isFinite(val) ? val : fallback;
}

/** 목록 응답 정규화 */
export function normalizeList<T>(raw: BackendList<T>): ListResponse<T> {
  let items: T[] = [];
  if (hasArrayProp<T>(raw, "items")) items = raw.items;
  else if (hasArrayProp<T>(raw, "data")) items = raw.data;

  const meta = isRecord(raw) ? raw : {};
  const page = readNumber(meta, "page", 1);
  const limit = readNumber(meta, "limit", items.length || 0);
  const total = readNumber(meta, "total", items.length || 0);

  return { items, page, limit, total };
}

/** 단건 응답 정규화 */
export function normalizeItem<T>(raw: BackendItem<T>): T {
  if (hasDataObject<T>(raw)) return raw.data;
  return raw as T;
}
