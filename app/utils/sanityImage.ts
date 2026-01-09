import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string;
const dataset = 'production';

const builder = imageUrlBuilder({ projectId, dataset });

export const urlForImage = (source: unknown): string | null => {
  try {
    if (!projectId) {
      return null;
    }
    // If source is already a URL string (e.g. blob:...), return it as is
    if (typeof source === 'string' && (source.startsWith('http') || source.startsWith('blob:'))) {
      return source;
    }
    // @sanity/image-url accepts ref string or image object
    return builder
      .image(source as never)
      .auto('format')
      .url();
  } catch {
    return null;
  }
};
