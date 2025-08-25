import type { ListResponse } from "@/lib/types";

const isServer = typeof window === "undefined";

/**
 * 서버에서는 환경변수 BACKEND_BASE를 사용,
 * 클라이언트에서는 Next API 프록시 "/api/backend" 사용.
 */
const SERVER_BASE = (process.env.BACKEND_BASE || "").replace(/\/$/, "");
const CLIENT_BASE = "/api/backend";

/** SSR에서 BACKEND_BASE 없을 때 명확히 에러 */
function ensureServerBase() {
  if (!SERVER_BASE) {
    throw new Error(
      "BACKEND_BASE is not set. Please set BACKEND_BASE in env (e.g. https://uzu-dev.onrender.com)"
    );
  }
}

/** 백엔드 절대경로 생성 */
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

/** 공통 GET(JSON) */
export async function getJSON<T>(url: string, revalidateSec = 60): Promise<T> {
  const res = await fetch(url, isServer ? { next: { revalidate: revalidateSec } } : {});
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} -> ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

/* =========================
   정규화 유틸
========================= */

type BackendList<T> =
  | { items: T[]; page?: number; limit?: number; total?: number }
  | { data: T[]; page?: number; limit?: number; total?: number };

type BackendItem<T> = T | { data: T };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
function hasItems<T>(raw: unknown): raw is { items: T[] } {
  return isObject(raw) && Array.isArray((raw as any).items);
}
function hasDataArray<T>(raw: unknown): raw is { data: T[] } {
  return isObject(raw) && Array.isArray((raw as any).data);
}
function hasDataObject<T>(raw: unknown): raw is { data: T } {
  return isObject(raw) && "data" in raw && !Array.isArray((raw as any).data);
}
function readNumber(obj: Record<string, unknown>, key: string, fallback: number): number {
  const v = obj[key];
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

/** 목록 응답 정규화: items | data → items */
export function normalizeList<T>(raw: BackendList<T>): ListResponse<T> {
  let items: T[] = [];
  if (hasItems<T>(raw)) items = raw.items;
  else if (hasDataArray<T>(raw)) items = raw.data;

  const meta = isObject(raw) ? (raw as Record<string, unknown>) : {};
  const page = readNumber(meta, "page", 1);
  const limit = readNumber(meta, "limit", items.length || 0);
  const total = readNumber(meta, "total", items.length || 0);

  return { items, page, limit, total };
}

/** 단건 응답 정규화: T | {data:T} → T */
export function normalizeItem<T>(raw: BackendItem<T>): T {
  if (hasDataObject<T>(raw)) {
    const obj = raw as Record<string, unknown>;
    return obj.data as T;
  }
  return raw as T;
}
