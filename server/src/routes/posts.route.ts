import { Router, type Request, type Response } from 'express';
import mongoose from 'mongoose';
import { Post } from '../models/post.model';
import { requireAdmin } from '../middleware/requireAdmin';
import { normalizeBody } from '../utils/normalize';
import { env } from '../config/env';

const router = Router();

function isValidationError(e: unknown): boolean {
  return e instanceof mongoose.Error.ValidationError || e instanceof mongoose.Error.CastError;
}

router.get('/', async (req: Request, res: Response) => {
  const { q = '', page = '1', limit = '20', type, category, tags } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const filter: Record<string, unknown> = { deletedAt: null };
  if (q) filter.$text = { $search: String(q) };
  if (type) filter.type = type;
  if (category) filter.category = category;

  if (tags) {
    const arr = tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (arr.length) filter.tags = { $in: arr };
  }

  try {
    const [data, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Post.countDocuments(filter),
    ]);
    res.json({ data, page: pageNum, limit: limitNum, total });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'internal server error' });
  }
});

/** GET /api/posts/:id */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const doc = await Post.findOne({ _id: req.params.id, deletedAt: null });
    if (!doc) return res.status(404).json({ error: 'Not Found' });
    res.json(doc);
  } catch (e) {
    if (isValidationError(e)) return res.status(404).json({ error: 'Not Found' });
    console.error(e);
    return res.status(500).json({ error: 'internal server error' });
  }
});

/** POST /api/posts (create) */
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const payload = normalizeBody(req.body || {});
    if (!payload.title) return res.status(400).json({ error: 'title required' });
    if (!payload.type) return res.status(400).json({ error: 'type required' });
    if (!payload.category) return res.status(400).json({ error: 'category required' });

    const created = await Post.create(payload);
    res.set('Location', `/api/posts/${created.id}`);
    return res.status(201).json(created);
  } catch (e) {
    if (isValidationError(e)) return res.status(400).json({ error: 'bad request' });
    console.error(e);
    return res.status(500).json({ error: 'internal server error' });
  }
});

/** POST /api/posts/:id (update) */
router.post('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const existing = await Post.findOne({ _id: req.params.id, deletedAt: null });
    if (!existing) return res.status(404).json({ error: 'Not Found' });

    const payload = normalizeBody(req.body || {});

    existing.set(payload);
    await existing.save();
    return res.status(200).json(existing);
  } catch (e) {
    if (isValidationError(e)) return res.status(400).json({ error: 'bad request' });
    console.error(e);
    return res.status(500).json({ error: 'internal server error' });
  }
});

/** DELETE /api/posts/:id */
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const query = { _id: req.params.id, deletedAt: null };
    const existed = env.HARD_DELETE
      ? await Post.findOneAndDelete(query)
      : await Post.findOneAndUpdate(query, { $set: { deletedAt: new Date() } });

    if (!existed) return res.status(404).json({ error: 'Not Found' });
    return res.status(204).end();
  } catch (e) {
    if (isValidationError(e)) return res.status(404).json({ error: 'Not Found' });
    console.error(e);
    return res.status(500).json({ error: 'internal server error' });
  }
});

export default router;
