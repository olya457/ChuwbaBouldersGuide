import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '../theme/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'soft' | 'strong' | 'accent';
}

const GlassPanel: React.FC<Props> = ({ children, style, variant = 'soft' }) => {
  const variantStyle =
    variant === 'strong' ? styles.strong : variant === 'accent' ? styles.accent : styles.soft;
  return <View style={[styles.base, variantStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 14,
  },
  soft: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
  },
  strong: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
  },
  accent: {
    backgroundColor: colors.chipBg,
    borderColor: colors.borderStrong,
  },
});

export default GlassPanel;