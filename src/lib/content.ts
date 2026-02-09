import { getCollection, type CollectionEntry } from 'astro:content';

export interface UiPost {
  id: string;
  title: string;
  date: Date;
  dateText: string;
  tags: string[];
  summary: string;
  thumbnail: string;
  categoryPath: string[];
  categoryLabel: string;
  url: string;
  legacyUrl: string;
  entry: CollectionEntry<'posts'>;
}

export interface CategorySummary {
  key: string;
  label: string;
  count: number;
}

export const UNCATEGORIZED_CATEGORY = 'Uncategorized';

const FALLBACK_DATE = new Date('1900-01-01T00:00:00.000Z');
const FALLBACK_THUMBNAIL = '/assets/img/thumbnail/empty.jpg';

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\\s\\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toDate(value: Date | undefined): Date {
  if (!value || Number.isNaN(value.getTime())) {
    return FALLBACK_DATE;
  }

  return value;
}

function toCategoryPath(id: string, explicit?: string[]): string[] {
  if (explicit && explicit.length > 0) {
    return explicit;
  }

  const segments = id.split('/');
  return segments.slice(0, -1);
}

function toSummary(entry: CollectionEntry<'posts'>): string {
  if (entry.data.summary && entry.data.summary.trim().length > 0) {
    return entry.data.summary.trim();
  }

  const plain = stripMarkdown(entry.body);
  return plain.slice(0, 170);
}

function normalizePost(entry: CollectionEntry<'posts'>): UiPost {
  const date = toDate(entry.data.date);
  const categoryPath = toCategoryPath(entry.id, entry.data.categoryPath);

  return {
    id: entry.id,
    title: entry.data.title,
    date,
    dateText: date.toISOString().slice(0, 10),
    tags: entry.data.tags ?? [],
    summary: toSummary(entry),
    thumbnail: entry.data.thumbnail || FALLBACK_THUMBNAIL,
    categoryPath,
    categoryLabel: categoryPath.join(' > ') || 'Home',
    url: `/${entry.id}.html`,
    legacyUrl: entry.data.legacy_url ?? `/${entry.id}.html`,
    entry
  };
}

export async function getPublishedPosts(): Promise<UiPost[]> {
  const posts = await getCollection('posts', ({ data }) => data.draft !== true);
  return posts.map(normalizePost).sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getCategorySummaries(posts: UiPost[]): CategorySummary[] {
  const map = new Map<string, CategorySummary>();

  for (const post of posts) {
    const root = post.categoryPath[0] ?? UNCATEGORIZED_CATEGORY;
    const current = map.get(root);

    if (current) {
      current.count += 1;
      continue;
    }

    map.set(root, {
      key: root,
      label: root,
      count: 1
    });
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function filterPostsByCategory(posts: UiPost[], slugParts: string[]): UiPost[] {
  if (slugParts.length === 0) {
    return posts;
  }

  if (slugParts.length === 1 && slugParts[0].toLowerCase() === UNCATEGORIZED_CATEGORY.toLowerCase()) {
    return posts.filter((post) => post.categoryPath.length === 0);
  }

  return posts.filter((post) => slugParts.every((segment, index) => post.categoryPath[index] === segment));
}

export function getCategoryPathKeys(posts: UiPost[]): Map<string, number> {
  const map = new Map<string, number>();

  for (const post of posts) {
    if (post.categoryPath.length === 0) {
      map.set(UNCATEGORIZED_CATEGORY, (map.get(UNCATEGORIZED_CATEGORY) ?? 0) + 1);
      continue;
    }

    for (let depth = 1; depth <= post.categoryPath.length; depth += 1) {
      const key = post.categoryPath.slice(0, depth).join('/');
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }

  return map;
}

export function paginatePosts(posts: UiPost[], currentPage: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const start = (safeCurrentPage - 1) * perPage;
  const end = start + perPage;

  return {
    totalPages,
    currentPage: safeCurrentPage,
    items: posts.slice(start, end)
  };
}
