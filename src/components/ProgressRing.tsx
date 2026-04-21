import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes } from '../theme/theme';

interface Props {
  value: number;
  total: number;
  size?: number;
  label?: string;
}

const ProgressRing: React.FC<Props> = ({ value, total, size = 120, label }) => {
  const progress = total > 0 ? value / total : 0;
  const pct = Math.round(progress * 100);
  const segments = 24;

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, anim]);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {Array.from({ length: segments }).map((_, i) => {
        const rotation = (360 / segments) * i;
        const isFilled = i / segments < progress;
        return (
          <View
            key={i}
            style={[
              styles.tick,
              {
                transform: [{ rotate: `${rotation}deg` }],
                height: size / 2,
                width: 2,
              },
            ]}
          >
            <View
              style={[
                styles.tickBar,
                {
                  backgroundColor: isFilled ? colors.mustard : colors.borderSoft,
                  height: isFilled ? 10 : 6,
                },
              ]}
            />
          </View>
        );
      })}
      <View style={styles.center}>
        <Text style={[styles.num, { fontSize: size * 0.22 }]}>{value}</Text>
        <Text style={styles.sub}>of {total}</Text>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <Text style={styles.pct}>{pct}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  tick: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tickBar: { width: 2, borderRadius: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  num: { color: colors.text, fontWeight: '900', letterSpacing: 0.5 },
  sub: { color: colors.textMuted, fontSize: fontSizes.xs, marginTop: -2 },
  label: { color: colors.mustard, fontSize: fontSizes.xs, fontWeight: '700', letterSpacing: 1, marginTop: 4 },
  pct: { color: colors.terracotta, fontSize: fontSizes.xs, fontWeight: '700', marginTop: 2 },
});

export default ProgressRing;