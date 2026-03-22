import { createApi } from 'unsplash-js';

let _api: ReturnType<typeof createApi> | null = null;

export function getUnsplashApi() {
  if (!_api) {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) throw new Error('UNSPLASH_ACCESS_KEY not configured');
    _api = createApi({ accessKey });
  }
  return _api;
}

export async function searchUnsplashImage(query: string): Promise<string | null> {
  try {
    const api = getUnsplashApi();
    const result = await api.search.getPhotos({
      query: `${query} Dubai`,
      perPage: 1,
      orientation: 'landscape',
    });

    if (result.response?.results?.[0]) {
      return result.response.results[0].urls.regular;
    }
    return null;
  } catch {
    return null;
  }
}
