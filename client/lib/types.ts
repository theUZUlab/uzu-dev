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
