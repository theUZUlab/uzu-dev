import Link from "next/link";

import type { Post } from "@/lib/types";

export default function ProjectCard({ post }: { post: Post }) {
  return (
    <Link href={`/projects/${post.category}/${post.id}`}>
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      <div>{post.tags?.join(" · ")}</div>
    </Link>
  );
}
