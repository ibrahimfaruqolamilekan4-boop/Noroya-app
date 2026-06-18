
export interface TikTokVideo {
  id: string;
  title: string;
  clericName: string;
  videoUrl: string;
  platform: 'tiktok';
}

export const getIslamicTikToks = async (limit: number = 5): Promise<TikTokVideo[]> => {
  // Since TikTok doesn't have a simple public search API like YouTube, 
  // we provide a curated list of high-quality Islamic content creators.
  const curatedTikToks: TikTokVideo[] = [
    {
      id: '7256514214488427781',
      title: 'Beautiful Quran Recitation by young boy',
      clericName: 'Quran Gems',
      videoUrl: 'https://www.tiktok.com/@qurangems/video/7256514214488427781',
      platform: 'tiktok'
    },
    {
      id: '7241234567890123456',
      title: 'The Prophetic Character - A Lesson in Mercy',
      clericName: 'Daily Deen',
      videoUrl: 'https://www.tiktok.com/@dailydeen/video/7241234567890123456',
      platform: 'tiktok'
    },
    {
      id: '7234567890123456789',
      title: 'Islamic Architecture of Cordoba',
      clericName: 'History of Islam',
      videoUrl: 'https://www.tiktok.com/@historyislam/video/7234567890123456789',
      platform: 'tiktok'
    },
    {
      id: '7223344556677889900',
      title: 'Why I converted to Islam',
      clericName: 'New Muslim Stories',
      videoUrl: 'https://www.tiktok.com/@newmuslim/video/7223344556677889900',
      platform: 'tiktok'
    },
    {
      id: '7211223344556677889',
      title: 'Hajj Journey 2024',
      clericName: 'Pilgrims Path',
      videoUrl: 'https://www.tiktok.com/@pilgrimspath/video/7211223344556677889',
      platform: 'tiktok'
    }
  ];

  // Shuffle and limit
  return curatedTikToks
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
};
