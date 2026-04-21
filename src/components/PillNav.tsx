import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fontSizes, IS_SMALL_SCREEN, radius } from '../theme/theme';

interface Item {
  key: string;
  label: string;
  emoji: string;
}

interface Props {
  items: Item[];
  active: string;
  onSelect: (key: string) => void;
}

const PillNav: React.FC<Props> = ({ items, active, onSelect }) => {
  const slide = useRef(new Animated.Value(0)).current;
  const activeIndex = items.findIndex(i => i.key === active);

  useEffect(() => {
    Animated.spring(slide, {
      toValue: activeIndex,
      friction: 8,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, slide]);

  return (
    <View style={styles.wrap}>
      {items.map((item, i) => {
        const isActive = i === activeIndex;
        return (
          <Pressable
            key={item.key}
            style={styles.item}
            onPress={() => onSelect(item.key)}
            hitSlop={4}
          >
            {isActive ? (
              <LinearGradient
                colors={[colors.terracotta, colors.mustard]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeBg}
              />
            ) : null}
            <Text style={[styles.emoji, isActive && styles.emojiActive]}>{item.emoji}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 4,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: IS_SMALL_SCREEN ? 8 : 10,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  activeBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.pill,
  },
  emoji: { fontSize: 14, color: colors.textMuted, marginRight: 6 },
  emojiActive: { color: colors.textInk },
  label: { color: colors.textMuted, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1 },
  labelActive: { color: colors.textInk },
});

export default PillNav;