export interface ArticleSection {
  title: string;
  subtitle: string;
  content: string;
}

export interface Ayah {
  arabic: string;
  translation: string;
  reference: string;
  background?: string;
}

export interface Article {
  id: string;
  title: string;
  heroText: string;
  prophet: string;
  theme: string;
  readTime: string;
  summary: string;
  sections: ArticleSection[];
  trial?: string;
  characterTrait?: string;
  modernLesson?: string;
  noorayaWisdom?: string;
  wisdomImage?: string;
  hasStarReflector?: boolean;
  hasMountainParallax?: boolean;
  hasBlastSound?: boolean;
  hasIdolSmashInteraction?: boolean;
  hasFireCoolingEffect?: boolean;
  hasHasbunallahBadge?: boolean;
  hasKaabaSpin?: boolean;
  hasSaiInteraction?: boolean;
  hasLutTransition?: boolean;
  hasSteadfastnessTracker?: boolean;
  hasZamzamScroll?: boolean;
  hasCalmHeartAudio?: boolean;
  hasPromiseTracker?: boolean;
  hasLineageMap?: boolean;
  hasShirtProgress?: boolean;
  hasDreamInterpreter?: boolean;
  hasRefugeButton?: boolean;
  hasYusufTransitions?: boolean;
  hasRestorationSpring?: boolean;
  hasPatienceTimer?: boolean;
  hasFairTradeScales?: boolean;
  hasMusaActs?: boolean;
  hasBrotherhoodSplit?: boolean;
  hasMagicianDuel?: boolean;
  hasSpeakSoftlyTracker?: boolean;
  hasAnimalSpeech?: boolean;
  hasGlassFloor?: boolean;
  hasBlinkOfAnEye?: boolean;
  hasGratitudeKingdom?: boolean;
  hasThreeDarknesses?: boolean;
  hasAbyssAudio?: boolean;
  hasGlowInTheDarkVerse?: boolean;
  hasTacticalMap?: boolean;
  hasMiracleGlow?: boolean;
  hasStatCard?: boolean;
  stats?: {
    battles?: string;
    losses?: string;
    battlesLost?: string;
    brokenSwords?: string;
    enemiesFaced?: string;
    strength?: string;
    signatureWeapon?: string;
    greatestBattle?: string;
    greatestFeat?: string;
    title?: string;
    trait?: string;
    feat?: string;
    quote?: string;
    weapon?: string;
    skill?: string;
    legacy?: string;
    event?: string;
  };
  hasHealingPlant?: boolean;
  hasSOSWidget?: boolean;
  hasZakariyaSilence?: boolean;
  hasInAppMihrab?: boolean;
  hasClayBirdAnimation?: boolean;
  hasBrotherhoodPair?: boolean;
  hasHiraTimer?: boolean;
  hasFinalSermonScroll?: boolean;
  hasMeccaToMedinaTransition?: boolean;
  hasBlindnessToSight?: boolean;
  hasGriefMeter?: boolean;
  hasFragrancePrompt?: boolean;
  hasWindStormExperience?: boolean;
  hasIronSoftening?: boolean;
  hasPsalmsAudio?: boolean;
  hasPromiseWidget?: boolean;
  hasDesertHermitStyle?: boolean;
  hasBadrEngine?: boolean;
  hasBrokenSwordEffect?: boolean;
  hasProphetEcho?: boolean;
  hasMeccanCrucibleStyle?: boolean;
  hasHeartbeatHaptic?: boolean;
  hasStarvationFilter?: boolean;
  hasTaifShake?: boolean;
  hasDhulFiqarEffect?: boolean;
  hasNoorMode?: boolean;
  hasGritMode?: boolean;
  hasMeccanBloodToWater?: boolean;
  hasGlowMiracle?: boolean;
  hasDualPathUX?: boolean;
  hasBattleMap?: boolean;
  hasBrokenSwordCounter?: boolean;
  hasScarMap?: boolean;
  hasSaifullahStyle?: boolean;
  hasSteelReflection?: boolean;
  hasGateLift?: boolean;
  hasEyeBlessing?: boolean;
  hasEgoMeter?: boolean;
  hasLionStyle?: boolean;
  hasHamzaStyle?: boolean;
  hasJafarStyle?: boolean;
  hasDoubleSwords?: boolean;
  hasEmeraldWings?: boolean;
  hasProtectorShield?: boolean;
  hasRoyalParchment?: boolean;
  hasBowSnap?: boolean;
  hasMusabStyle?: boolean;
  hasSilkToRoughTransition?: boolean;
  hasFlagBearerLock?: boolean;
  hasHalfShroudOverlay?: boolean;
  hasFragranceIntro?: boolean;
  hasAbuBakrStyle?: boolean;
  hasCaveSilhouette?: boolean;
  hasSpiderWebOverlay?: boolean;
  hasTearDropTrigger?: boolean;
  hasTrenchStyle?: boolean;
  hasDiggingInteraction?: boolean;
  hasLightningStrikes?: boolean;
  hasTacticalOverlay?: boolean;
  hasPurpleFade?: boolean;
  hasSlowScrollEffect?: boolean;
  hasBoulderStrike?: boolean;
  surahId?: number;
  ayahs: Ayah[];
  color: string;
  narrationUrl?: string;
  type: 'prophet' | 'companion' | 'righteous' | 'science' | 'history' | 'commander';
  is_published?: boolean;
  storylineBackgrounds?: string[];
  isCaveExperience?: boolean;
  isGardenStory?: boolean;
  interactionType?: 'gratitude' | 'wisdom' | 'badge' | 'trust' | 'reflection' | 'nomination' | 'quiz' | 'justice' | 'waqf';
  ambientType?: 'cave' | 'desert' | 'home' | 'nature';
  reflectionPrompt?: string;
  badgeUnlock?: string;
  keywords?: string[];
  wisdomCards?: {
    title: string;
    content: string;
    icon?: string;
  }[];
  isHighDensityNarrative?: boolean;
  scrollPosition?: number;
  hasCosmicAscent?: boolean;
  hasPrayerReduction?: boolean;
  hasProphetFloatingBadges?: boolean;
  hasBlindnessBlur?: boolean;
  hasSuraqahFriction?: boolean;
  hasFirmSandScroll?: boolean;
  hasBattleShudder?: boolean;
  hasDustSwipe?: boolean;
  hasArchersSplit?: boolean;
  hasChaosRedFlash?: boolean;
  hasLivingMartyrHold?: boolean;
  hasFiresBackground?: boolean;
  hasIdolShatter?: boolean;
  hasMercyTransition?: boolean;
}

export interface TafsirVerse {
  id: string;
  surah: string;
  verseNumber: string;
  arabic: string;
  translation: string;
  misunderstanding: string;
  context: {
    when: string;
    why: string;
    who: string;
  };
  explanation: string;
  clarifyingHadithId?: string;
  tags: string[];
}

export interface Hadith {
  id: string;
  arabic: string;
  translation: string;
  source: string;
  grade: string;
  modernApplication: string;
  tags: string[];
  relatedVerseId?: string;
  actionSteps?: string[];
}

export type ViewState = 'library' | 'article' | 'favorites' | 'profile' | 'bayan';

export interface AppState {
  view: ViewState;
  selectedArticleId: string | null;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'cleric' | 'scholar' | 'admin';
  noorLevel: number;
}
