// @ts-ignore
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  categoryId: string;
  platform: 'youtube';
}

export const searchIslamicVideos = async (query: string = 'Islamic lectures', maxResults: number = 12): Promise<YouTubeVideo[]> => {
  if (!API_KEY) {
    console.warn('YouTube API Key missing. Please set VITE_YOUTUBE_API_KEY in secrets.');
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&videoEmbeddable=true&key=${API_KEY}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.warn('YouTube API Error:', error.error?.message || 'Invalid key or quota exceeded');
      return [];
    }

    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      categoryId: item.snippet.categoryId || '0',
      platform: 'youtube'
    }));
  } catch (error: any) {
    console.error('Error fetching YouTube videos:', error?.message || String(error));
    return [];
  }
};

export const getVideosByCategory = async (category: string): Promise<YouTubeVideo[]> => {
  const query = `Islamic ${category}`;
  return searchIslamicVideos(query);
};
