import { ImageSourcePropType } from 'react-native';

export type DistrictId = 'mountains' | 'promenade' | 'taste' | 'science' | 'peace';

export type Rarity = 'common' | 'rare' | 'legendary';

export interface District {
  id: DistrictId | 'all';
  title: string;
  emoji: string;
  accent: string;
}

export interface Artifact {
  id: string;
  title: string;
  subtitle: string;
  district: DistrictId;
  rarity: Rarity;
  address: string;
  gpsText: string;
  gpsDecimal: string;
  latitude: number;
  longitude: number;
  description: string;
  stampColor: string;
  image: ImageSourcePropType;
}

export type DiscoveryCategory = 'intelligence' | 'health' | 'uniqueness';

export interface Discovery {
  id: string;
  category: DiscoveryCategory;
  icon: string;
  title: string;
  description: string;
}

export interface JournalPost {
  id: string;
  title: string;
  tag: string;
  intro: string;
  body: string[];
  readTime: string;
  date: string;
  author: string;
  cover: ImageSourcePropType;
  featured?: boolean;
}

export interface ChallengeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface OnboardingSlide {
  id: string;
  tag: string;
  title: string;
  message: string;
  image: ImageSourcePropType;
}

export type MainTabParamList = {
  Atlas: undefined;
  Collection: undefined;
  Map: undefined;
  Journal: undefined;
  Discoveries: undefined;
  Challenge: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: { screen?: keyof MainTabParamList } | undefined;
  ArtifactDetail: { artifactId: string };
  JournalEntry: { postId: string };
  ChallengeGame: { level?: number } | undefined;
  ChallengeResult: {
    score: number;
    total: number;
    answers: boolean[];
    level: number;
    isPerfect: boolean;
    hasNextLevel: boolean;
  };
};