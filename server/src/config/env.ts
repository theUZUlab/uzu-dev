import dotenv from 'dotenv';
dotenv.config();

function toArrayEnv(v: string | undefined): string[] {
    if (!v) return ['*'];
    return v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

export const env = {
    PORT: Number(process.env.PORT || 3001),
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGODB_URI: process.env.MONGODB_URI || '',
    ADMIN_TOKEN: process.env.ADMIN_TOKEN || '',
    CORS_ALLOW_ORIGIN: toArrayEnv(process.env.CORS_ALLOW_ORIGIN),
    HARD_DELETE: process.env.HARD_DELETE === '1',
};

if (!env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in .env');
    process.exit(1);
}

// CORS 옵션 구성
export const corsOptions = env.CORS_ALLOW_ORIGIN.includes('*') ? {} : { origin: env.CORS_ALLOW_ORIGIN };
