// 공용 Fetch/URL 유틸 (SSR/CSR 모두 지원)

export const isServer = typeof window === "undefined";

// 서버에서 백엔드 직접 호출 (예: https://uzu-dev.onrender.com)
const SERVER_BASE = (process.env.BACKEND_BASE || "").replace(/\/$/, "");

// 클라이언트에서 Next API 라우트 프록시를 통해 호출 (/api/backend/** → /api/** 로 프록시)
const CLIENT_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "/api").replace(/\/$/, "") + "/backend";

/** 서버/클라이언트 상황에 따라 알맞은 베이스를 붙여 최종 URL을 만듭니다.
 *  - `path`는 백엔드 실제 경로로 넣어주세요. 예: "/api/posts", "/api/posts/123"
 */
export function buildApiUrl(
  path: string,
  qs?: Record<string, string | number | undefined | null>
): string {
  const base = isServer ? SERVER_BASE : CLIENT_BASE;
  const p = path.startsWith("/") ? path : `/${path}`;
  const sp = new URLSearchParams();
  if (qs) {
    for (const [k, v] of Object.entries(qs)) {
      if (v === undefined || v === null) continue;
      sp.set(k, String(v));
    }
  }
  const q = sp.toString();
  // 서버에서는 SERVER_BASE + "/api/..." 로, 클라이언트에서는 "/api/backend" + "/api/..."
  if (isServer) {
    if (!SERVER_BASE) {
      throw new Error(
        "BACKEND_BASE is not set. Please set BACKEND_BASE (e.g. https://uzu-dev.onrender.com)"
      );
    }
  }
  return q ? `${base}${p}?${q}` : `${base}${p}`;
}

/** 공통 GET(JSON)
 *  - 서버(SSR/RSC)에서는 `revalidate` 사용
 *  - 클라이언트에서는 일반 fetch
 */
export async function getJSON<T>(url: string, revalidateSec = 60): Promise<T> {
  const res = await fetch(url, isServer ? { next: { revalidate: revalidateSec } } : {});
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} -> ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}
