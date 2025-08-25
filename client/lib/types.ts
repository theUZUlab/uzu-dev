/* ========== 기본 포스트 타입 ========== */
export type PostType = "project" | "blog";

export type Post = {
  id: string;
  title: string;
  type: PostType;
  category: string;
  tags: string[];
  thumbnail: string;
  date: string | null;
  description: string;
  summary: string;
  repoUrl?: string;
  deployUrl?: string;
  createdAt: string;
  updatedAt: string;
};

/* ========== 목록 응답 공통 ========== */
export interface ListResponse<T = Post> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

/* ========== 메타/라이트 타입 ========== */
export type CategoryStat = { name: string; count: number };
export type TagStat = { name: string; count: number };

export type PostLite = {
  id?: string;
  type?: PostType;
  category?: string | null;
  tags?: string[];
  date?: string | null;
};
