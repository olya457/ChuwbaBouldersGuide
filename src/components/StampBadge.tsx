import React from 'react';
import { Animated, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fontSizes, IS_SMALL_SCREEN } from '../theme/theme';
import { useFadeInScale } from '../hooks/useFadeIn';

interface Props {
  letter: string;
  color: string;
  earned?: boolean;
  size?: number;
  label?: string;
  rarity?: 'common' | 'rare' | 'legendary';
  delay?: number;
  style?: ViewStyle;
}

const StampBadge: React.FC<Props> = ({
  letter,
  color,
  earned = false,
  size,
  label,
  rarity,
  delay = 0,
  style,
}) => {
  const baseSize = size ?? (IS_SMALL_SCREEN ? 70 : 82);
  const { opacity, scale } = useFadeInScale(delay, 420);

  const borderStyle =
    rarity === 'legendary' ? 3 : rarity === 'rare' ? 2 : 1.5;

  return (
    <Animated.View style={[{ opacity, transform: [{ scale }] }, style]}>
      <View
        style={[
          styles.outer,
          {
            width: baseSize,
            height: baseSize,
            borderRadius: baseSize / 2,
            borderColor: earned ? color : colors.borderSoft,
            borderWidth: earned ? borderStyle : 1,
            backgroundColor: earned ? `${color}22` : 'transparent',
          },
        ]}
      >
        <View
          style={[
            styles.inner,
            {
              width: baseSize - 16,
              height: baseSize - 16,
              borderRadius: (baseSize - 16) / 2,
              borderColor: earned ? color : colors.borderSoft,
              borderStyle: 'dashed',
            },
          ]}
        >
          <Text
            style={[
              styles.letter,
              {
                color: earned ? color : colors.textDim,
                fontSize: baseSize * 0.36,
              },
            ]}
          >
            {letter}
          </Text>
        </View>
      </View>
      {label ? (
        <Text
          style={[
            styles.label,
            { color: earned ? colors.text : colors.textDim },
          ]}
          numberOfLines={2}
        >
          {label}
        </Text>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  letter: {
    fontWeight: '900',
    letterSpacing: 1,
  },
  label: {
    marginTop: 6,
    fontSize: fontSizes.xs,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default StampBadge;