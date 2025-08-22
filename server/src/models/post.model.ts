import { Schema, model, models, type HydratedDocument } from 'mongoose';

/**
 * 스키마:
 * id(자동), title, tag, thumbnail, date, description, summary
 * - id 는 _id 로부터 파생된 가상 필드로 JSON 응답에 포함
 */
const PostSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        tag: [{ type: String, trim: true }],
        thumbnail: { type: String, default: '', trim: true },
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

export type PostDoc = {
    id: string;
    title: string;
    tag: string[];
    thumbnail: string;
    date: string | null;
    description: string;
    summary: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export const Post = models.Post || model('Post', PostSchema);
