import { Schema, model, models, type HydratedDocument } from 'mongoose';

const TYPES = ['project', 'blog'] as const;
export type PostType = (typeof TYPES)[number];

const PostSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        type: { type: String, enum: TYPES, required: true, index: true },
        category: { type: String, required: true, trim: true, index: true },
        tags: [{ type: String, trim: true, index: true }],
        thumbnail: { type: String, default: '', trim: true },
        repoUrl: { type: String, default: '', trim: true },
        deployUrl: { type: String, default: '', trim: true },
        date: { type: String, default: null },
        description: { type: String, default: '' },
        summary: { type: String, default: '', trim: true },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (_doc: HydratedDocument<any>, ret: Record<string, any>) => {
                if (ret._id) {
                    ret.id = String(ret._id);
                    delete ret._id;
                }
                return ret;
            },
        },
    }
);

// 검색/정렬 인덱스
PostSchema.index({ title: 'text', summary: 'text', description: 'text' });
PostSchema.index({ createdAt: -1 });
// 목록 필터링 최적화
PostSchema.index({ type: 1, category: 1, createdAt: -1 });

export type PostDoc = {
    id: string;
    title: string;
    type: PostType;
    category: string;
    tags: string[];
    thumbnail: string;
    repoUrl: string;
    deployUrl: string;
    date: string | null;
    description: string;
    summary: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export const Post = models.Post || model('Post', PostSchema);
