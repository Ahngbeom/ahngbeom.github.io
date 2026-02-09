import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../lib/content';
import type { SearchIndexItem } from '../types/search';

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();

  const payload: SearchIndexItem[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    tags: post.tags,
    categoryPath: post.categoryPath,
    date: post.dateText,
    url: post.url,
    summary: post.summary
  }));

  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
};
