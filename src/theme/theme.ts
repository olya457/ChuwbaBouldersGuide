import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const IS_SMALL_SCREEN = height < 720;
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

export const ANDROID_EDGE_PADDING = 20;

export const colors = {
  bg: '#0E1020',
  bgAlt: '#141830',
  surface: 'rgba(255, 150, 180, 0.06)',
  surfaceAlt: 'rgba(233, 98, 140, 0.09)',
  surfaceActive: 'rgba(233, 98, 140, 0.2)',

  border: 'rgba(255, 180, 120, 0.18)',
  borderSoft: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(233, 98, 140, 0.4)',

  terracotta: '#E9628C',
  terracottaDeep: '#C84575',
  mustard: '#F5B84E',
  mustardSoft: '#E9A840',
  sage: '#7C9885',
  sageDeep: '#5E7B68',
  dusk: '#5B3F6B',
  paper: '#F5E6D3',

  text: '#F8E8D8',
  textMuted: 'rgba(248, 232, 216, 0.65)',
  textDim: 'rgba(248, 232, 216, 0.4)',
  textInk: '#1A1018',

  success: '#7C9885',
  danger: '#D14A5C',
  warning: '#F5B84E',

  chipBg: 'rgba(233, 98, 140, 0.16)',
  chipBgMustard: 'rgba(245, 184, 78, 0.15)',
  chipBgSage: 'rgba(124, 152, 133, 0.15)',

  tabBarBg: 'rgba(20, 24, 48, 0.96)',

  gradientStart: '#E9628C',
  gradientEnd: '#F5B84E',
  gradientAltStart: '#7C9885',
  gradientAltEnd: '#E9628C',
  gradientNightStart: '#0E1020',
  gradientNightEnd: '#2A1830',
};

export const fontSizes = {
  xs: IS_SMALL_SCREEN ? 10 : 11,
  sm: IS_SMALL_SCREEN ? 11 : 13,
  md: IS_SMALL_SCREEN ? 13 : 15,
  lg: IS_SMALL_SCREEN ? 16 : 18,
  xl: IS_SMALL_SCREEN ? 20 : 24,
  xxl: IS_SMALL_SCREEN ? 26 : 32,
  display: IS_SMALL_SCREEN ? 32 : 42,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  huge: 40,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 28,
  pill: 999,
};

export const districtColors: Record<string, string> = {
  mountains: '#7C9885',
  promenade: '#E9628C',
  taste: '#F5B84E',
  science: '#5B3F6B',
  peace: '#5E7B68',
};

export const rarityColors: Record<string, string> = {
  common: '#7C9885',
  rare: '#E9628C',
  legendary: '#F5B84E',
};