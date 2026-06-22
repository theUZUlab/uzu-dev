"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { listCategories } from "@/lib/api/meta";
import type { CategoryStat } from "@/lib/types";

type NavData = {
  projCats: CategoryStat[];
  blogCats: CategoryStat[];
  loading: boolean;
};

const NavDataCtx = createContext<NavData>({ projCats: [], blogCats: [], loading: true });
NavDataCtx.displayName = "NavDataContext";

const CAT_TTL = 60 * 60 * 1000;
let catCache: { proj: CategoryStat[]; blog: CategoryStat[]; ts: number } | null = null;

export function NavDataProvider({ children }: { children: ReactNode }) {
  const [projCats, setProjCats] = useState<CategoryStat[]>(() => catCache?.proj ?? []);
  const [blogCats, setBlogCats] = useState<CategoryStat[]>(() => catCache?.blog ?? []);
  const [loading, setLoading] = useState(() => catCache === null || Date.now() - catCache.ts > CAT_TTL);

  useEffect(() => {
    if (catCache && Date.now() - catCache.ts <= CAT_TTL) return;
    let alive = true;
    (async () => {
      try {
        const [p, b] = await Promise.all([
          listCategories("project", { limit: 100 }),
          listCategories("blog", { limit: 100 }),
        ]);
        if (!alive) return;
        catCache = { proj: p, blog: b, ts: Date.now() };
        setProjCats(p);
        setBlogCats(b);
      } catch (e) {
        console.warn("[NavData] 카테고리 로드 실패:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <NavDataCtx.Provider value={{ projCats, blogCats, loading }}>
      {children}
    </NavDataCtx.Provider>
  );
}

export function useNavData() {
  return useContext(NavDataCtx);
}
