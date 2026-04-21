import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import { useAppInsets } from '../hooks/useInsets';
import { colors, IS_IOS, IS_SMALL_SCREEN, radius } from '../theme/theme';

const TAB_META: Record<string, { label: string; emoji: string }> = {
  Atlas: { label: 'ATLAS', emoji: '◈' },
  Collection: { label: 'STAMPS', emoji: '◉' },
  Map: { label: 'MAP', emoji: '◇' },
  Journal: { label: 'JOURNAL', emoji: '✎' },
  Discoveries: { label: 'WONDERS', emoji: '✦' },
  Challenge: { label: 'QUIZ', emoji: '◆' },
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useAppInsets();
  const [barWidth, setBarWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const tabCount = state.routes.length;
  const tabWidth = tabCount > 0 && barWidth > 0 ? barWidth / tabCount : 0;

  useEffect(() => {
    if (tabWidth <= 0) return;
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      friction: 8,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth, translateX]);

  const onBarLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== barWidth) {
      setBarWidth(w);
      const tw = w / tabCount;
      translateX.setValue(state.index * tw);
    }
  };

  const bottom = Math.max(insets.bottom, IS_IOS ? 12 : 18);

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom }]}>
      <View style={styles.bar} onLayout={onBarLayout}>
        {tabWidth > 0 ? (
          <Animated.View
            style={[
              styles.indicator,
              {
                width: tabWidth - 8,
                transform: [{ translateX }],
              },
            ]}
          >
            <LinearGradient
              colors={[colors.terracotta, colors.mustard]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        ) : null}

        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const meta = TAB_META[route.name] ?? { label: route.name.toUpperCase(), emoji: '·' };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              hitSlop={4}
              style={styles.tab}
            >
              <Text style={[styles.emoji, focused && styles.emojiActive]}>
                {meta.emoji}
              </Text>
              <Text
                style={[styles.label, focused && styles.labelActive]}
                numberOfLines={1}
              >
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 12,
    right: 12,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.tabBarBg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingVertical: IS_SMALL_SCREEN ? 6 : 8,
    width: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
  indicator: {
    position: 'absolute',
    top: IS_SMALL_SCREEN ? 6 : 8,
    bottom: IS_SMALL_SCREEN ? 6 : 8,
    left: 4,
    borderRadius: radius.pill,
    opacity: 0.24,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: IS_SMALL_SCREEN ? 4 : 6,
  },
  emoji: {
    fontSize: IS_SMALL_SCREEN ? 16 : 18,
    color: colors.textMuted,
    fontWeight: '900',
    marginBottom: 2,
  },
  emojiActive: { color: colors.mustard },
  label: {
    fontSize: IS_SMALL_SCREEN ? 8 : 9,
    color: colors.textMuted,
    fontWeight: '900',
    letterSpacing: 1,
  },
  labelActive: { color: colors.mustard },
});

export default CustomTabBar;