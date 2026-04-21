import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ANDROID_EDGE_PADDING, IS_ANDROID } from '../theme/theme';

export const useAppInsets = () => {
  const insets = useSafeAreaInsets();
  const top = IS_ANDROID ? Math.max(insets.top, ANDROID_EDGE_PADDING) : insets.top;
  const bottom = IS_ANDROID ? Math.max(insets.bottom, ANDROID_EDGE_PADDING) : insets.bottom;
  return { top, bottom, left: insets.left, right: insets.right };
};