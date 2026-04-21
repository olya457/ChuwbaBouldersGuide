import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppInsets } from '../hooks/useInsets';
import { colors } from '../theme/theme';

interface Props {
  children: React.ReactNode;
  withTabBarSpace?: boolean;
  style?: ViewStyle;
  contentPaddingTop?: boolean;
  variant?: 'default' | 'splash';
}

const ScreenFrame: React.FC<Props> = ({
  children,
  withTabBarSpace = false,
  style,
  contentPaddingTop = true,
  variant = 'default',
}) => {
  const insets = useAppInsets();

  const gradientColors = variant === 'splash'
    ? [colors.bg, colors.dusk, colors.terracottaDeep]
    : [colors.bg, colors.bgAlt, colors.bg];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.decorTopRight}>
        <View style={[styles.circle, { backgroundColor: colors.terracotta, opacity: 0.08 }]} />
      </View>
      <View style={styles.decorBottomLeft}>
        <View style={[styles.circle, { backgroundColor: colors.mustard, opacity: 0.06 }]} />
      </View>
      <View
        style={[
          styles.content,
          {
            paddingTop: contentPaddingTop ? insets.top : 0,
            paddingBottom: withTabBarSpace ? insets.bottom + 96 : insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, overflow: 'hidden' },
  content: { flex: 1 },
  decorTopRight: { position: 'absolute', top: -120, right: -120 },
  decorBottomLeft: { position: 'absolute', bottom: -140, left: -140 },
  circle: { width: 280, height: 280, borderRadius: 140 },
});

export default ScreenFrame;