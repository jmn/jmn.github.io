import parseFrontMatter, { FrontMatterResult } from "front-matter";
import fs from "fs/promises";
import path from "path";
import { bundleMDX } from "./mdx.server";
import haskell from "highlight.js/lib/languages/haskell";
import { existsSync } from "./fs.server";

export type Post = {
  slug: string;
  title: string;
  description: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

export async function getPost(slug: string) {
  const filename = path.join(`${__dirname}/../blog-posts`, slug + ".mdx");
  if (!existsSync(filename)) {
    return undefined;
  }
  const source = await fs.readFile(filename, "utf-8");
  const rehypeHighlight = await import("rehype-highlight").then(
    (mod) => mod.default
  );
  const { default: remarkGfm } = await import("remark-gfm");
  const { default: rehypeAutolinkHeadings } = await import(
    "rehype-autolink-headings"
  );

  const { default: rehypeToc } = await import("rehype-toc");
  const { default: rehypeSlug } = await import("rehype-slug");

  const post = await bundleMDX({
    source,
    xdmOptions(options, frontmatter) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        // remarkMdxImages,
        remarkGfm,
        // remarkBreaks,
        // [remarkFootnotes, { inlineNotes: true }],
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeAutolinkHeadings,
        rehypeSlug,
        rehypeToc,
        [
          rehypeHighlight,
          { format: "detect", ignoreMissing: true, languages: { haskell } },
        ],
      ];

      return options;
    },
  }).catch((e) => {
    console.error(e);
    throw e;
  });

  return post;
}

export async function getPosts(): Promise<Post[]> {
  const postsPath = await fs.readdir(`${__dirname}/../blog-posts`, {
    withFileTypes: true,
  });

  const posts = await Promise.all(
    postsPath.map(async (dirent) => {
      const file = await fs.readFile(
        path.join(`${__dirname}/../blog-posts`, dirent.name)
      );
      const { attributes } = parseFrontMatter<any>(file.toString());
      return {
        slug: dirent.name.replace(/\.mdx/, ""),
        title: attributes.title,
        description: attributes.description
      };
    })
  );

  return posts;
}
