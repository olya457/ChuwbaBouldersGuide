import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fontSizes, IS_SMALL_SCREEN, radius } from '../theme/theme';

interface Props {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
}

const GradientButton: React.FC<Props> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled,
  variant = 'primary',
}) => {
  if (variant === 'outline') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[styles.base, styles.outline, style, disabled && styles.disabled]}
      >
        <Text style={[styles.text, { color: colors.mustard }, textStyle]}>{title}</Text>
      </Pressable>
    );
  }

  if (variant === 'ghost') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[styles.base, styles.ghost, style, disabled && styles.disabled]}
      >
        <Text style={[styles.text, { color: colors.textMuted }, textStyle]}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.pressable, style, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={[colors.terracotta, colors.mustard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={[styles.text, { color: colors.textInk }, textStyle]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: { borderRadius: radius.pill, overflow: 'hidden', width: '100%' },
  gradient: {
    width: '100%',
    paddingVertical: IS_SMALL_SCREEN ? 14 : 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: IS_SMALL_SCREEN ? 48 : 54,
  },
  base: {
    width: '100%',
    paddingVertical: IS_SMALL_SCREEN ? 14 : 16,
    paddingHorizontal: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: IS_SMALL_SCREEN ? 48 : 54,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.mustard,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: fontSizes.md,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  disabled: { opacity: 0.5 },
});

export default GradientButton;