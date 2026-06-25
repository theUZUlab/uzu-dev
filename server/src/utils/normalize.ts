type PostInput = {
  title?: unknown;
  type?: unknown;
  category?: unknown;
  tags?: unknown;
  thumbnail?: unknown;
  date?: unknown;
  description?: unknown;
  summary?: unknown;
  repoUrl?: unknown;
  deployUrl?: unknown;
};

type Normalized = Partial<{
  title: string;
  type: 'project' | 'blog';
  category: string;
  tags: string[];
  thumbnail: string;
  date: string; // 기존 형식을 유지 (null 처리 필요 시 라우터/스키마에서)
  description: string;
  summary: string;
  repoUrl: string;
  deployUrl: string;
}>;

function parseTags(v: unknown): string[] {
  const items: string[] = Array.isArray(v)
    ? v.map(String)
    : typeof v === 'string'
      ? v.split(',')
      : [];
  return [...new Set(items.map((s) => s.trim()).filter(Boolean))];
}

export function normalizeBody(body: PostInput): Normalized {
  const out: Normalized = {};

  if (typeof body.title === 'string') {
    const s = body.title.trim();
    if (s) out.title = s;
  }

  let nextType: 'project' | 'blog' | undefined;
  if (typeof body.type === 'string') {
    const t = body.type.trim().toLowerCase();
    if (t === 'project' || t === 'blog') {
      out.type = t;
      nextType = t;
    }
  }

  if (typeof body.category === 'string') {
    const s = body.category.trim();
    if (s) out.category = s;
  }

  const parsed = parseTags(body.tags);
  if (parsed.length) out.tags = parsed;

  if (typeof body.thumbnail === 'string') {
    const s = body.thumbnail.trim();
    if (s) out.thumbnail = s;
  }

  if (typeof body.date === 'string') {
    const s = body.date.trim();
    if (s) out.date = s;
  }

  if (typeof body.description === 'string') {
    out.description = body.description;
  }

  if (typeof body.summary === 'string') {
    const s = body.summary.trim();
    if (s) out.summary = s;
  }

  // project → blog 전환 시 링크 초기화
  if (nextType === 'blog') {
    out.repoUrl = '';
    out.deployUrl = '';
  }

  if (nextType === 'project') {
    if (typeof body.repoUrl === 'string') {
      const s = body.repoUrl.trim();
      if (s) out.repoUrl = s;
    }
    if (typeof body.deployUrl === 'string') {
      const s = body.deployUrl.trim();
      if (s) out.deployUrl = s;
    }
  }

  return out;
}
