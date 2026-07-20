import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  coverImage: string;
  coverAlt: string;
  author: string;
  readingMinutes: number;
};

export type Post = PostMeta & { contentHtml: string };

function parsePost(slug: string) {
  const raw = fs.readFileSync(path.join(postsDirectory, `${slug}.md`), 'utf8');
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  const meta: PostMeta = {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    category: data.category ?? 'Guides',
    coverImage: data.coverImage ?? '/images/placeholder.webp',
    coverAlt: data.coverAlt ?? data.title,
    author: data.author ?? 'Jason Berry',
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
  return { meta, content };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parsePost(f.replace(/\.md$/, '')).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!fs.existsSync(path.join(postsDirectory, `${slug}.md`))) return null;
  const { meta, content } = parsePost(slug);
  const processed = await remark().use(html).process(content);
  return { ...meta, contentHtml: processed.toString() };
}

export function formatPostDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
