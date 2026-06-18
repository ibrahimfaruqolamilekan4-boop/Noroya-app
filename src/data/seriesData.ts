
export interface SeriesEpisode {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  youtubeId: string;
  article?: string;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  cleric: string;
  totalEpisodes: number;
  episodes: SeriesEpisode[];
  category: 'Seerah' | 'Prophets' | 'History';
}

export const propheticSeries: Series[] = [
  {
    id: 'seerah-yasir-qadhi',
    title: 'The Seerah of Prophet Muhammad (SAW)',
    description: 'A masterpiece detailing the life of the Final Messenger from before birth to the final days in Madinah.',
    cleric: 'Dr. Yasir Qadhi',
    totalEpisodes: 104,
    coverImage: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop',
    category: 'Seerah',
    episodes: [
      { 
        id: '1', 
        title: 'The Prophetic Character: A Beacon of Light', 
        duration: '58:20', 
        thumbnail: 'https://img.youtube.com/vi/VO4ovS_Zp9I/hqdefault.jpg', 
        youtubeId: 'VO4ovS_Zp9I',
        article: `The life of Prophet Muhammad (SAW) was a living testament to the highest form of human ethics. Born in 570 CE, he arrived into a world of hardship. He was an orphan before he was born, and lost his mother at six. Yet, he rose to be 'Al-Amin'—The Trustworthy.

**For Our Non-Muslim Friends:**
Islam means 'Submission to Peace'. The Prophet (SAW) taught that 'even a smile is charity.' His life proves that mercy can change the world more than power. He was a man who, despite facing the loss of all his children except one, never lost his compassion. He became a father to the fatherless and a voice for the voiceless.`
      },
      { 
        id: '1.2', 
        title: 'The Year of Sadness & The Ascencion', 
        duration: '48:10', 
        thumbnail: 'https://img.youtube.com/vi/8S-f6Tf55p0/hqdefault.jpg', 
        youtubeId: '8S-f6Tf55p0',
        article: `After the loss of his beloved wife Khadijah and his protecting uncle Abu Talib, the Prophet (SAW) faced his darkest year. Yet, it was followed by the Isra and Mi'raj—the night journey to the heavens. This teaches us that after every hardship comes ease. It was during this journey that the five daily prayers were gifted to humanity as a direct link between the soul and its Creator.`
      },
      { 
        id: '2', 
        title: 'The Migration (Hijra): A Turning Point', 
        duration: '52:15', 
        thumbnail: 'https://img.youtube.com/vi/w6Y7-uI6DLo/hqdefault.jpg', 
        youtubeId: 'w6Y7-uI6DLo',
        article: `The Hijra was not a retreat; it was a strategic shift toward building a society based on justice. In Madinah, the Prophet (SAW) established a constitution that protected the rights of all citizens, including Jewish and Christian communities. This was the first pluralistic society in history, built on mutual respect and shared responsibility.`
      },
      { 
        id: '3', 
        title: 'The Final Sermon: A Manifesto for Humanity', 
        duration: '55:30', 
        thumbnail: 'https://img.youtube.com/vi/9xM7hC83tTM/hqdefault.jpg', 
        youtubeId: '9xM7hC83tTM',
        article: `Standing on the Mount of Mercy, the Prophet (SAW) declared: 'An Arab has no superiority over a non-Arab... except by piety.' He called for the rights of women, the end of racial discrimination, and economic justice. These words are as relevant today as they were 1400 years ago, calling us to a global brotherhood based on merit and character.`
      },
      { 
        id: '4', 
        title: 'The Conquest of Makkah: Victory of Mercy', 
        duration: '62:10', 
        thumbnail: 'https://img.youtube.com/vi/mI6X-3W7h0U/hqdefault.jpg', 
        youtubeId: 'mI6X-3W7h0U',
        article: `When he returned to Makkah with 10,000 companions, the city that had tortured him lay at his feet. Instead of vengeance, he offered a general amnesty. 'Go, you are free,' he said. This act transformed his fiercest enemies into his most loyal followers, proving that the ultimate conquest is the conquest of hearts through forgiveness.`
      },
    ]
  },
  {
    id: 'stories-prophets-mufti-menk',
    title: 'Stories of the Prophets',
    description: 'Learn from the lives of Adam, Nuh, Ibrahim, Musa, and Isa (peace be upon them all).',
    cleric: 'Mufti Menk',
    totalEpisodes: 30,
    coverImage: 'https://images.unsplash.com/photo-1590076214667-c0f33b98c442?q=80&w=2070&auto=format&fit=crop',
    category: 'Prophets',
    episodes: [
      { 
        id: 'p1', 
        title: 'Prophet Adam (AS)', 
        duration: '45:10', 
        thumbnail: 'https://img.youtube.com/vi/X0SsqS5M_6g/hqdefault.jpg', 
        youtubeId: 'X0SsqS5M_6g',
        article: `The story of the first human being and the first Prophet. We explore the creation of Adam (AS), the residence in Paradise, the trial with Iblis, and the subsequent descent to Earth. This story teaches us about repentance, the nature of human weakness, and the vast mercy of Allah (SWT).`
      },
      { id: 'p2', title: 'Prophet Nuh (AS)', duration: '42:50', thumbnail: 'https://img.youtube.com/vi/zZByXp28m88/hqdefault.jpg', youtubeId: 'zZByXp28m88' },
      { id: 'p3', title: 'Prophet Ibrahim (AS)', duration: '48:15', thumbnail: 'https://img.youtube.com/vi/m_Xb51Lw50c/hqdefault.jpg', youtubeId: 'm_Xb51Lw50c' },
    ]
  },
  {
    id: 'companions-omar-suleiman',
    title: 'The Firsts (Companions)',
    description: 'The stories of those who stood by the Messenger (SAW) through every hardship.',
    cleric: 'Omar Suleiman',
    totalEpisodes: 50,
    coverImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1964&auto=format&fit=crop',
    category: 'History',
    episodes: [
      { id: 'c1', title: 'Khadijah bint Khuwaylid', duration: '35:20', thumbnail: 'https://img.youtube.com/vi/aZ3-WCOmFpk/hqdefault.jpg', youtubeId: 'aZ3-WCOmFpk' },
      { id: 'c2', title: 'Abu Bakr As-Siddiq', duration: '38:45', thumbnail: 'https://img.youtube.com/vi/8S-f6Tf55p0/hqdefault.jpg', youtubeId: '8S-f6Tf55p0' },
    ]
  }
];
