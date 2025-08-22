type PostInput = {
    title?: unknown;
    type?: unknown;
    category?: unknown;
    tags?: unknown;
    thumbnail?: unknown;
    date?: unknown;
    description?: unknown;
    summary?: unknown;
};

type Normalized = Partial<{
    title: string;
    type: 'project' | 'blog';
    category: string;
    tags: string[];
    thumbnail: string;
    date: string;
    description: string;
    summary: string;
}>;

export function normalizeBody(body: PostInput): Normalized {
    const out: Normalized = {};

    // title
    if (typeof body.title === 'string') {
        const s = body.title.trim();
        if (s) out.title = s;
    }

    // type
    if (typeof body.type === 'string') {
        const t = body.type.trim().toLowerCase();
        if (t === 'project' || t === 'blog') out.type = t;
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

    // date
    if (typeof body.date === 'string') {
        const s = body.date.trim();
        if (s) out.date = s;
    }

    // description
    if (typeof body.description === 'string') {
        out.description = body.description;
    }

    // summary
    if (typeof body.summary === 'string') {
        const s = body.summary.trim();
        if (s) out.summary = s;
    }

    return out;
}
