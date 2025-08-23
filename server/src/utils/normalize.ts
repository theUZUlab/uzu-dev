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

export function normalizeBody(body: PostInput): Normalized {
    const out: Normalized = {};

    // title
    if (typeof body.title === 'string') {
        const s = body.title.trim();
        if (s) out.title = s;
    }

    // type
    let nextType: 'project' | 'blog' | undefined;
    if (typeof body.type === 'string') {
        const t = body.type.trim().toLowerCase();
        if (t === 'project' || t === 'blog') {
            out.type = t;
            nextType = t;
        }
    }

    // category
    if (typeof body.category === 'string') {
        const s = body.category.trim();
        if (s) out.category = s;
    }

    // tags
    const parseTags = (v: unknown): string[] => {
        if (Array.isArray(v)) {
            return [
                ...new Set(
                    v
                        .map(String)
                        .map((s) => s.trim())
                        .filter(Boolean)
                ),
            ];
        }
        if (typeof v === 'string') {
            return [
                ...new Set(
                    v
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                ),
            ];
        }
        return [];
    };
    const parsed = parseTags((body as any).tags);
    if (parsed.length) out.tags = parsed;

    // thumbnail
    if (typeof body.thumbnail === 'string') {
        const s = body.thumbnail.trim();
        if (s) out.thumbnail = s;
    }

    // date (문자열 그대로 유지)
    if (typeof body.date === 'string') {
        const s = body.date.trim();
        if (s) out.date = s;
    }

    // description (원문 그대로)
    if (typeof body.description === 'string') {
        out.description = body.description;
    }

    // summary
    if (typeof body.summary === 'string') {
        const s = body.summary.trim();
        if (s) out.summary = s;
    }

    // -----------------------------
    // project 전용 링크 처리
    // -----------------------------
    // 1) 요청이 type=blog 라면 링크를 빈 문자열로 강제 초기화(프로젝트→블로그 전환 시 정리)
    if (nextType === 'blog') {
        out.repoUrl = '';
        out.deployUrl = '';
    }

    // 2) 요청이 type=project 라면 링크를 반영(공백은 무시)
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
