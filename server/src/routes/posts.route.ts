import { Router } from 'express';
import { Post } from '../models/post.model';
import { requireAdmin } from '../middleware/requireAdmin';
import { normalizeBody } from '../utils/normalize';

const router = Router();

/**
 * GET /api/posts
 * - 목록 조회 (검색/페이지네이션)
 *   ?q=  : 텍스트 검색 (title/summary/description)
 *   ?page, ?limit
 */
router.get('/', async (req, res) => {
    const { q = '', page = '1', limit = '20' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const filter: any = { deletedAt: null };

    if (q) filter.$text = { $search: String(q) };

    const [data, total] = await Promise.all([
        Post.find(filter)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum),
        Post.countDocuments(filter),
    ]);

    res.json({ data, page: pageNum, limit: limitNum, total });
});

/**
 * GET /api/posts/:id
 * - 단건 조회
 */
router.get('/:id', async (req, res) => {
    const doc = await Post.findOne({ _id: req.params.id, deletedAt: null });
    if (!doc) return res.status(404).json({ error: 'Not Found' });
    res.json(doc);
});

/**
 * POST /api/posts
 * - 생성 (id 제외 전부 본문으로 입력)
 */
router.post('/', requireAdmin, async (req, res) => {
    try {
        const payload = normalizeBody(req.body || {});
        if (!payload.title) return res.status(400).json({ error: 'title required' });

        const created = await Post.create(payload);
        res.set('Location', `/api/posts/${created.id}`);
        return res.status(201).json(created);
    } catch (e: any) {
        if (String(e).includes('invalid date')) return res.status(400).json({ error: 'invalid date' });
        console.error(e);
        return res.status(400).json({ error: 'bad request' });
    }
});

/**
 * POST /api/posts/:id
 * - 수정 (본문 형식은 생성과 동일, id는 경로로 전달)
 */
router.post('/:id', requireAdmin, async (req, res) => {
    try {
        const existing = await Post.findOne({ _id: req.params.id, deletedAt: null });
        if (!existing) return res.status(404).json({ error: 'Not Found' });

        const payload = normalizeBody(req.body || {});
        if (payload.title === '') return res.status(400).json({ error: 'title cannot be empty' });

        Object.assign(existing, payload);
        await existing.save();
        return res.status(200).json(existing);
    } catch (e: any) {
        if (String(e).includes('invalid date')) return res.status(400).json({ error: 'invalid date' });
        console.error(e);
        return res.status(400).json({ error: 'bad request' });
    }
});

/**
 * DELETE /api/posts/:id
 * - 삭제 (기본: 소프트 삭제 / HARD_DELETE=1 이면 하드 삭제)
 */
router.delete('/:id', requireAdmin, async (req, res) => {
    const hard = process.env.HARD_DELETE === '1';
    if (hard) {
        await Post.deleteOne({ _id: req.params.id });
    } else {
        await Post.updateOne({ _id: req.params.id }, { $set: { deletedAt: new Date() } });
    }
    return res.status(204).end();
});

export default router;
