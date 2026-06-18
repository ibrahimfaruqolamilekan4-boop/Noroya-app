export interface DailyHadith {
  id: string;
  category: 'Character & Manners' | 'Faith (Iman)' | 'Supplication (Dua)' | 'Stories of wisdom';
  source: string;
  narrator: string;
  arabic: string;
  translation: string;
  grade: string;
}

export const DAILY_HADITH_STREAM: DailyHadith[] = [
  // Category 1: Character & Manners
  {
    id: "dh-char-1",
    category: "Character & Manners",
    source: "Sahih al-Bukhari",
    narrator: "Abu Hurayrah",
    arabic: "إِنَّمَا بُعِثْتُ لأُتَمِّمَ مَكَارِمَ الأَخْلاَقِ",
    translation: "Indeed, I was sent only to perfect noble character and beautiful conduct.",
    grade: "Sahih"
  },
  {
    id: "dh-char-2",
    category: "Character & Manners",
    source: "Sahih al-Bukhari",
    narrator: "Abdullah ibn Amr",
    arabic: "خِيَارُكُمْ أَحَاسِنُكُمْ أَخْلاقًا",
    translation: "The best among you are those who have the best character and noble manners.",
    grade: "Sahih"
  },
  {
    id: "dh-char-3",
    category: "Character & Manners",
    source: "Sahih al-Bukhari",
    narrator: "Abu Hurayrah",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translation: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
    grade: "Sahih"
  },
  {
    id: "dh-char-4",
    category: "Character & Manners",
    source: "Sahih Muslim",
    narrator: "Abu Hurayrah",
    arabic: "الْمُسْلِمُ مَنْ سَلَمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    translation: "A true Muslim is the one from whose tongue and hand other Muslims are completely safe.",
    grade: "Sahih"
  },
  {
    id: "dh-char-5",
    category: "Character & Manners",
    source: "Sahih al-Bukhari",
    narrator: "Anas ibn Malik",
    arabic: "يَسِّرُوا وَلا تُعَسِّرُوا، وَبَشِّرُوا وَلا تُنَفِّرُوا",
    translation: "Give good tidings and do not push people away; make things easy for others and do not make things difficult.",
    grade: "Sahih"
  },
  {
    id: "dh-char-6",
    category: "Character & Manners",
    source: "Sunan al-Tirmidhi",
    narrator: "Aishah bint Abi Bakr",
    arabic: "إِنَّ مِنْ أَكْمَلِ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا وَأَلْطَفُهُمْ بِأَهْلِهِ",
    translation: "The most perfect of believers in faith are those with the best character, and the gentlest to their families.",
    grade: "Sahih"
  },

  // Category 2: Faith (Iman)
  {
    id: "dh-faith-1",
    category: "Faith (Iman)",
    source: "Sahih al-Bukhari",
    narrator: "Umar ibn al-Khattab",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    translation: "Actions are judged by intentions, and every person shall have only that which they intended.",
    grade: "Sahih"
  },
  {
    id: "dh-faith-2",
    category: "Faith (Iman)",
    source: "Sahih al-Bukhari",
    narrator: "Anas ibn Malik",
    arabic: "لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    translation: "None of you will truly believe until he loves for his brother what he loves for himself.",
    grade: "Sahih"
  },
  {
    id: "dh-faith-3",
    category: "Faith (Iman)",
    source: "Sahih Muslim",
    narrator: "Abu Hurayrah",
    arabic: "الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً، فَأَفْضَلُهَا قَوْلُ لاَ إِلَهَ إِلاَّ اللَّهُ، وَأَدْنَاهَا إِمَاطَةُ الأَذَى عَنِ الطَّرِيقِ",
    translation: "Faith has over seventy branches, the most excellent of which is the declaration 'There is no deity but Allah', and the humblest of which is removing an obstacle from the road.",
    grade: "Sahih"
  },
  {
    id: "dh-faith-4",
    category: "Faith (Iman)",
    source: "Sahih Muslim",
    narrator: "Abu Hurayrah",
    arabic: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ",
    translation: "A strong believer is better and more beloved to Allah than a weak believer, though there is goodness in both.",
    grade: "Sahih"
  },
  {
    id: "dh-faith-5",
    category: "Faith (Iman)",
    source: "Sahih Muslim",
    narrator: "Sufyan ibn Abdullah",
    arabic: "قُلْ آمَنْتُ بِاللَّهِ ثُمَّ اسْتَقِمْ",
    translation: "Say: 'I believe in Allah,' and then remain steadfast and upright on the path.",
    grade: "Sahih"
  },
  {
    id: "dh-faith-6",
    category: "Faith (Iman)",
    source: "Sahih Muslim",
    narrator: "Anas ibn Malik",
    arabic: "ذَاقَ طَعْمَ الإِيمَانِ مَنْ رَضِيَ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ رَسُولاً",
    translation: "He has tasted the sweetness of faith who is content with Allah as his Lord, Islam as his religion, and Muhammad as his Messenger.",
    grade: "Sahih"
  },

  // Category 3: Supplication (Dua)
  {
    id: "dh-dua-1",
    category: "Supplication (Dua)",
    source: "Sunan al-Tirmidhi",
    narrator: "Anas ibn Malik",
    arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
    translation: "Supplication (Dua) is the very heart and essence of worship.",
    grade: "Sahih"
  },
  {
    id: "dh-dua-2",
    category: "Supplication (Dua)",
    source: "Sunan al-Tirmidhi",
    narrator: "Abu Hurayrah",
    arabic: "لَيْسَ شَيْءٌ أَكْرَمَ عَلَى اللَّهِ تَعَالَى مِنَ الدُّعَاءِ",
    translation: "There is nothing more noble or honorable in the sight of Allah the Almighty than supplication.",
    grade: "Sahih"
  },
  {
    id: "dh-dua-3",
    category: "Supplication (Dua)",
    source: "Sunan al-Tirmidhi",
    narrator: "Abu Hurayrah",
    arabic: "مَنْ لَمْ يَسْأَلِ اللَّهَ يَغْضَبْ عَلَيْهِ",
    translation: "Whoever does not ask of Allah, He becomes angry with him; as asking is an act of relying on the King of kings.",
    grade: "Sahih"
  },
  {
    id: "dh-dua-4",
    category: "Supplication (Dua)",
    source: "Sunan al-Tirmidhi",
    narrator: "Abu Hurayrah",
    arabic: "ادْعُوا اللَّهَ وَأَنْتُمْ مُوقِنُونَ بِالإِجَابَةِ",
    translation: "Call upon Allah with absolute certainty that your prayers will be answered, for Allah does not answer a prayer from a distracted heart.",
    grade: "Sahih"
  },
  {
    id: "dh-dua-5",
    category: "Supplication (Dua)",
    source: "Sahih al-Bukhari",
    narrator: "Shaddad ibn Aws",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ",
    translation: "O Allah, You are my Lord; there is no deity except You. You created me, and I am Your loyal servant.",
    grade: "Sahih"
  },
  {
    id: "dh-dua-6",
    category: "Supplication (Dua)",
    source: "Sahih Muslim",
    narrator: "Abu Hurayrah",
    arabic: "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ، فَأَكْثِرُوا الدُّعَاءَ",
    translation: "The nearest a servant comes to his Lord is when he is in prostration (Sujud), so increase supplication abundantly during it.",
    grade: "Sahih"
  },

  // Category 4: Stories of wisdom
  {
    id: "dh-story-1",
    category: "Stories of wisdom",
    source: "Sahih al-Bukhari",
    narrator: "Abu Hurayrah",
    arabic: "بَيْنَمَا رَجُلٌ يَمْشِي بِطَرِيقٍ اشْتَدَّ عَلَيْهِ الْعَطَشُ، فَوَجَدَ بِئْرًا فَنَزَلَ فِيهَا فَشَرِبَ، ثُمَّ خَرَجَ فَإِذَا كَلْبٌ يَلْهَثُ يَأْكُلُ الثَّرَى مِنَ الْعَطَشِ... فَسَقَاهُ، فَشَكَرَ اللَّهُ لَهُ فَغَفَرَ لَهُ",
    translation: "While a man was walking, he suffered intense thirst. Finding a well, he climbed down and drank. Upon coming up, he saw a panting dog licking damp soil from severe thirst. He retrieved water in his leather sock to save the dog. Allah appreciated his mercy and forgave all his sins.",
    grade: "Sahih"
  },
  {
    id: "dh-story-2",
    category: "Stories of wisdom",
    source: "Sahih al-Bukhari",
    narrator: "Abu Hurayrah",
    arabic: "بَيْنَمَا امْرَأَةٌ بَغِيٌّ مِنْ بَغَايَا بَنِي إِسْرَائِيلَ رَأَتْ كَلْبًا يُطِيفُ بِرَكِيَّةٍ كَادَ يَقْتُلُهُ الْعَطَشُ، فَنَزَعَتْ مُوقَهَا فَسَقَتْهُ فَغُفِرَ لَهَا بِهِ",
    translation: "A woman who had been a sinner from the Children of Israel saw a dog pacing around a well, close to dying of thirst. Deeply touched, she removed her shoe, tied it with her veil, drew water to quench its thirst, and was fully forgiven by Allah for this single, pure act of empathy.",
    grade: "Sahih"
  },
  {
    id: "dh-story-3",
    category: "Stories of wisdom",
    source: "Sahih al-Bukhari",
    narrator: "Abu Hurayrah",
    arabic: "كَانَ رَجُلٌ يُدَايِنُ النَّاسَ، فَكَانَ يَقُولُ لِفَتَاهُ: إِذَا أَتَيْتَ مُعْسِرًا فَتَجَاوَزْ عَنْهُ، لَعَلَّ اللَّهَ أَنْ يَتَجَاوَزَ عَنَّا. فَلَقِيَ اللَّهَ فَتَجَاوَزَ عَنْهُ",
    translation: "There was a merchant who used to offer loans to the public. He would instruct his assistant: 'If you encounter a debtor under tight financial constraints, wave off their debt completely. Perhaps Allah will overlook our misdeeds.' When he met his Lord, Allah waived off his sins and pardoned him.",
    grade: "Sahih"
  },
  {
    id: "dh-story-4",
    category: "Stories of wisdom",
    source: "Sahih al-Bukhari",
    narrator: "Abu Hurayrah",
    arabic: "اشْتَرَى رَجُلٌ مِنْ رَجُلٍ عَقَارًا لَهُ، فَوَجَدَ الرَّجُلُ الَّذِي اشْتَرَى الْعَقَارَ فِي عَقَارِهِ جَرَّةً فِيهَا ذَهَبٌ... فَقَالَ الآخَرُ: إِنَّمَا بِعْتُكَ الأَرْضَ وَمَا فِيهَا... فَتَحَاكَمَا إِلَى رَجُلٍ فَقَالَ: أَلَكُمَا وَلَدٌ؟ فَقَالَ أَحَدُهُمَا: لِي غُلاَمٌ. وَقَالَ الآخَرُ: لِي جَارِيَةٌ. قَالَ: أَنْكِحَا الْغُلاَمَ الْجَارِيَةَ وَأَنْفِقَا عَلَى أَنْفُسِهِمَا مِنْهُ وَتَصَدَّقَا",
    translation: "A man bought a plot of land and discovered a jar full of raw gold. He went to the seller and stated: 'Please take your gold, for I only purchased the land, not the gold!' The seller responded: 'I sold you the acreage and all it contained.' They sought arbitration from an elder who advised: 'Let your son and daughter marry, support their family with this gold, and spend the remainder in charity.'",
    grade: "Sahih"
  },
  {
    id: "dh-story-5",
    category: "Stories of wisdom",
    source: "Sahih Muslim",
    narrator: "Abu Hurayrah",
    arabic: "بَيْنَا رَجُلٌ بِفَلاَةٍ مِنَ الأَرْضِ، فَسَمِعَ صَوْتًا فِي سَحَابَةٍ: اسْقِ حَدِيقَةَ فُلاَنٍ... فَتَتَبَّعَ السَّحَابَ فَإِذَا هُوَ يُفْرِغُ مَاءَهُ فِي حَرَّةٍ... فَإِذَا رَجُلٌ قَائِمٌ فِي حَدِيقَتِهِ يُحَوِّلُ الْمَاءَ بِمِسْحَاتِهِ... فَقَالَ لَهُ: يَا عَبْدَ اللَّهِ، مَا اسْمُكَ؟ قَالَ: فُلاَنٌ... لِلِاسْمِ الَّذِي سَمِعَ فِي السَّحَابَةِ... فَقَالَ: مَا تَصْنَعُ فِيهَا؟ قَالَ: أَنْظُرُ إِلَى مَا يَخْرُجُ مِنْهَا فَأَتَصَدَّقُ بِثُلُثِهِ، وَآكُلُ أَنَا وَعِيَالِي ثُلُثًا، وَأَرُدُّ فِيهَا ثُلُثَهُ",
    translation: "While a traveler was standing in a barren desert, he heard a voice in a cloud commanding: 'Water the orchard of so-and-so.' The traveler carefully tracked the cloud until it rained down onto a fenced garden. He saw a farmer guiding the water with a shovel. Upon asking the farmer's name, it matched the voice in the cloud. Intrigued, he asked why. The farmer replied: 'Whatever this land produces, I return one-third back into the soil as seed, we consume one-third as a family, and I dedicate one-third entirely as direct charity to the pool of needy.'",
    grade: "Sahih"
  },
  {
    id: "dh-story-6",
    category: "Stories of wisdom",
    source: "Sahih al-Bukhari",
    narrator: "Abu Hurayrah",
    arabic: "كَانَ فِي بَنِي إِسْرَائِيلَ رَجُلٌ سَأَلَ بَعْضَ بَنِي إِسْرَائِيلَ أَنْ يُسْلِفَهُ أَلْفَ دِينَارٍ، فَقَالَ: ائْتِنِي بِالشُّهَدَاءِ. قَالَ: كَفَى بِاللَّهِ شَهِيدًا... فَخَرَجَ فِي الْبَحْرِ فَقَضَى حَاجَتَهُ، ثُمَّ الْتَمَسَ مَرْكَبًا يَقَدَمُ عَلَيْهِ... فَلَمْ يَجِدْ مَرْكَبًا، فَأَخَذَ خَشَبَةً فَنَقَرَهَا فَأَدْخَلَ فِيهَا أَلْفَ دِينَارٍ وَصَحِيفَةً مِنْهُ إِلَى صَاحِبِهِ...",
    translation: "A man requested a gold loan. The lender demanded witnesses, and he responded: 'Allah is sufficient as a witness.' Intrigued by his faith, the lender agreed. When repayment day approached, the borrower searched for a boat but found none. Relying on trust, he drilled a hollow log, loaded 1,000 gold coins and a letter, sealed it, and cast it into the sea, praying to Allah. The lender, waiting on the shore, fished the log out for firewood and discovered the gold, fully paid on time through absolute divine custody.",
    grade: "Sahih"
  }
];
