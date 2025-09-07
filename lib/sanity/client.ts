import { QueryParams, QueryWithoutParams } from '@sanity/client';
import { createClient } from 'next-sanity';

// Centralized Sanity client configured for public, cached reads
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  stega: false,
});

export type SanityFetchOptions = {
  revalidate?: number;
  tags?: string[];
};

export async function sanityFetch<T>(
  query: string,
  params: QueryWithoutParams | QueryParams = {},
  options?: SanityFetchOptions
): Promise<T> {
  const nextOptions = options
    ? { next: { revalidate: options.revalidate, tags: options.tags } }
    : undefined;
  // Allow Next.js caching hints via the third argument
  return sanityClient.fetch<T>(query, params, nextOptions);
}
