/* ==============================================
   PinsByMe — Type Definitions
   ============================================== */

export interface AestheticIdentity {
  primary: string;
  secondary: string[];
  emoji: string;
  tagline: string;
  description: string;
  recentKeywords?: string[];
}

export interface ColorAura {
  name: string;
  colors: string[];
  description: string;
  mood: string;
}

export interface VisualTheme {
  name: string;
  percentage: number;
  emoji: string;
}

export interface VibeProfile {
  trait: string;
  value: number; // 0-100
  label: string;
}

export interface HiddenAesthetic {
  name: string;
  confidence: number;
  description: string;
  emoji: string;
}

export interface AestheticDriftPoint {
  period: string;
  aesthetic: string;
  color: string;
}

export interface UserProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  totalPins: number;
  totalBoards: number;
}

export interface ShopProduct {
  title: string;
  note: string;
  emoji: string;
  bg?: string;
  url: string;
}

export interface StoryData {
  user: UserProfile;
  identity: AestheticIdentity;
  colorAura: ColorAura;
  themes: VisualTheme[];
  vibes: VibeProfile[];
  feelsLike: string;
  hiddenAesthetics: HiddenAesthetic[];
  drift: AestheticDriftPoint[];
  gradient?: string;
  categoryTag?: string;
  headCategories?: string;
  fixation?: string;
  alsoSaves?: string;
  shopProducts?: ShopProduct[];
}

export interface StoryCardProps {
  data: StoryData;
  isActive: boolean;
}
