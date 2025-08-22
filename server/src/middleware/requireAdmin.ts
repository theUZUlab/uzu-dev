import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

/**
 * ADMIN_TOKEN 이 설정된 경우에만 쓰기 (POST/DELETE) 허용
 * 설정이 없으면 개발 편의상 오픈 (운영에서는 반드시 설정 권장)
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!env.ADMIN_TOKEN) return next();

    const auth = String(req.get('authorization') || '');
    if (auth === `Bearer ${env.ADMIN_TOKEN}`) return next();

    return res.status(401).json({ error: 'Unauthorized' });
}
