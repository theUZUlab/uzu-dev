// lib/markdown.ts
import { unified, type Plugin } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { visit } from "unist-util-visit";
import type { Schema } from "hast-util-sanitize";

const shiftHeadings: Plugin = () => {
  return (tree: any) => {
    visit(tree, "heading", (node: { depth: number }) => {
      if (node.depth === 1) node.depth = 4;
      if (node.depth === 2) node.depth = 5;
      if (node.depth === 3) node.depth = 6;
    });
  };
};

const schema: Schema = {
  ...defaultSchema,
  attributes: {
    ...(defaultSchema.attributes || {}),
    a: [...(defaultSchema.attributes?.a || []), ["target", "rel", "href", "title"]],
    img: [
      ...(defaultSchema.attributes?.img || []),
      ["src", "alt", "title", "width", "height", "loading", "decoding"],
    ],
    code: [...(defaultSchema.attributes?.code || []), ["className"]],
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
    "br",
  ],
};

export async function renderMarkdown(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(shiftHeadings)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(md ?? "");
  return String(file);
}
