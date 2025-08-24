import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import type { Schema } from "hast-util-sanitize";

const schema = {
  ...defaultSchema,
  attributes: {
    ...(defaultSchema.attributes || {}),
    a: [...(defaultSchema.attributes?.a || []), ["target", "rel", "href", "title"]],
    img: [
      ...(defaultSchema.attributes?.img || []),
      ["src", "alt", "title", "width", "height", "loading", "decoding"],
    ],
    code: [...(defaultSchema.attributes?.code || []), ["className"]],
    pre: [...(defaultSchema.attributes?.pre || [])],
    table: [...(defaultSchema.attributes?.table || [])],
    thead: [...(defaultSchema.attributes?.thead || [])],
    tbody: [...(defaultSchema.attributes?.tbody || [])],
    tr: [...(defaultSchema.attributes?.tr || [])],
    th: [...(defaultSchema.attributes?.th || [])],
    td: [...(defaultSchema.attributes?.td || [])],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "code",
    "pre",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "hr",
  ],
};

export async function renderMarkdown(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkRehype)
    .use(rehypeSanitize, schema as Schema)
    .use(rehypeStringify)
    .process(md ?? "");

  return String(file);
}
