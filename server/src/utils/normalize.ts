/**
 * 클라이언트 바디를 받아 저장 가능한 형태로 정규화합니다.
 * - tag: 배열 또는 콤마 문자열 허용 (중복 제거)
 * - date: 문자열 그대로 저장 (필요 시 간단 검증 가능)
 * - thumbnail: 공백 트리밍 (빈 문자열은 무시)
 */

type PostInput = {
    title?: unknown;
    tag?: unknown;
    thumbnail?: unknown;
    date?: unknown;
    description?: unknown;
    summary?: unknown;
};

type Normalized = Partial<{
    title: string;
    tag: string[];
    thumbnail: string;
    date: string;
    description: string;
    summary: string;
}>;

export function normalizeBody(body: PostInput): Normalized {
    const out: Normalized = {};

    if (typeof body.title === 'string') {
        const s = body.title.trim();
        if (s) out.title = s;
    }

    if (Array.isArray(body.tag)) {
        const arr = body.tag
            .map(String)
            .map((s) => s.trim())
            .filter((s): s is string => s.length > 0);
        if (arr.length) out.tag = [...new Set(arr)];
    } else if (typeof body.tag === 'string') {
        const arr = body.tag
            .split(',')
            .map((s: string) => s.trim())
            .filter((s): s is string => s.length > 0);
        if (arr.length) out.tag = [...new Set(arr)];
    }

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

    return out;
}
