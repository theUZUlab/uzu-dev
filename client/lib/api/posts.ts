import { cache } from "react";
import {
  buildUrl,
  getJSON,
  normalizeItem,
  normalizeList,
  type BackendItem,
  type BackendList,
} from "@/lib/http";
import type { Post } from "@/lib/types";
import type { ListResponse } from "@/lib/types";

/* =========================
   Projects
========================= */
export async function listProjects(params?: {
  q?: string;
  page?: number;
  limit?: number;
  category?: string;
  tags?: string[]; // OR 조건
  revalidateSec?: number;
}): Promise<ListResponse<Post>> {
  const url = buildUrl("/api/posts", {
    type: "project",
    q: params?.q,
    page: params?.page ?? 1,
    limit: params?.limit ?? 20,
    category: params?.category,
    tags: params?.tags && params.tags.length ? params.tags.join(",") : undefined,
  });

  const raw = await getJSON<BackendList<Post>>(url, params?.revalidateSec ?? 60);
  return normalizeList<Post>(raw);
}

export const getProjectById = cache(async (id: string, revalidateSec = 60): Promise<Post> => {
  const safeId = encodeURIComponent(id);
  const url = buildUrl(`/api/posts/${safeId}`);
  const raw = await getJSON<BackendItem<Post>>(url, revalidateSec);
  return normalizeItem<Post>(raw);
});

/* =========================
   Blogs
========================= */
export async function listBlogs(params?: {
  q?: string;
  page?: number;
  limit?: number;
  category?: string;
  tags?: string[]; // OR 조건
  revalidateSec?: number;
}): Promise<ListResponse<Post>> {
  const url = buildUrl("/api/posts", {
    type: "blog",
    q: params?.q,
    page: params?.page ?? 1,
    limit: params?.limit ?? 20,
    category: params?.category,
    tags: params?.tags && params.tags.length ? params.tags.join(",") : undefined,
  });

  const raw = await getJSON<BackendList<Post>>(url, params?.revalidateSec ?? 60);
  return normalizeList<Post>(raw);
}

export const getBlogById = cache(async (id: string, revalidateSec = 60): Promise<Post> => {
  const safeId = encodeURIComponent(id);
  const url = buildUrl(`/api/posts/${safeId}`);
  const raw = await getJSON<BackendItem<Post>>(url, revalidateSec);
  return normalizeItem<Post>(raw);
});
