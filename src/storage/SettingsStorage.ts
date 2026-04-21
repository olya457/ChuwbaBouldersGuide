import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from './StorageKeys';

export interface ChallengeProgress {
  level: number;
  indexInLevel: number;
  score: number;
  answers: boolean[];
}

export const SettingsStorage = {
  async setOnboardingCompleted(value: boolean): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.ONBOARDING_COMPLETED, JSON.stringify(value));
  },
  async getOnboardingCompleted(): Promise<boolean> {
    const raw = await AsyncStorage.getItem(StorageKeys.ONBOARDING_COMPLETED);
    return raw ? JSON.parse(raw) === true : false;
  },
  async getCollection(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(StorageKeys.COLLECTION);
    return raw ? (JSON.parse(raw) as string[]) : [];
  },
  async setCollection(list: string[]): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.COLLECTION, JSON.stringify(list));
  },
  async getVisited(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(StorageKeys.VISITED);
    return raw ? (JSON.parse(raw) as string[]) : [];
  },
  async setVisited(list: string[]): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.VISITED, JSON.stringify(list));
  },
  async getEarnedStamps(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(StorageKeys.EARNED_STAMPS);
    return raw ? (JSON.parse(raw) as string[]) : [];
  },
  async setEarnedStamps(list: string[]): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.EARNED_STAMPS, JSON.stringify(list));
  },
  async getDiscoveriesSeen(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(StorageKeys.DISCOVERIES_SEEN);
    return raw ? (JSON.parse(raw) as string[]) : [];
  },
  async setDiscoveriesSeen(list: string[]): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.DISCOVERIES_SEEN, JSON.stringify(list));
  },
  async getBestScore(): Promise<number> {
    const raw = await AsyncStorage.getItem(StorageKeys.CHALLENGE_BEST_SCORE);
    return raw ? Number(raw) : 0;
  },
  async setBestScore(value: number): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.CHALLENGE_BEST_SCORE, String(value));
  },
  async getChallengeProgress(): Promise<ChallengeProgress | null> {
    const raw = await AsyncStorage.getItem(StorageKeys.CHALLENGE_PROGRESS);
    return raw ? (JSON.parse(raw) as ChallengeProgress) : null;
  },
  async setChallengeProgress(progress: ChallengeProgress): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.CHALLENGE_PROGRESS, JSON.stringify(progress));
  },
  async clearChallengeProgress(): Promise<void> {
    await AsyncStorage.removeItem(StorageKeys.CHALLENGE_PROGRESS);
  },
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      StorageKeys.ONBOARDING_COMPLETED,
      StorageKeys.COLLECTION,
      StorageKeys.VISITED,
      StorageKeys.CHALLENGE_BEST_SCORE,
      StorageKeys.CHALLENGE_PROGRESS,
      StorageKeys.EARNED_STAMPS,
      StorageKeys.DISCOVERIES_SEEN,
    ]);
  },
};