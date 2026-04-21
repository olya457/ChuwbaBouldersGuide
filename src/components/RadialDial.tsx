import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { District } from '../types';
import { colors, fontSizes, IS_SMALL_SCREEN } from '../theme/theme';

interface Props {
  districts: District[];
  active: District['id'];
  onChange: (id: District['id']) => void;
  size?: number;
}

const RadialDial: React.FC<Props> = ({ districts, active, onChange, size }) => {
  const dialSize = size ?? (IS_SMALL_SCREEN ? 240 : 280);
  const radiusDist = dialSize / 2 - 36;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const count = districts.length;
  const activeIndex = Math.max(0, districts.findIndex(d => d.id === active));

  useEffect(() => {
    if (count <= 1) return;
    Animated.timing(rotateAnim, {
      toValue: activeIndex,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeIndex, rotateAnim, count]);

  if (count === 0) {
    return null;
  }

  const activeDistrict = districts[activeIndex];

  const rotation =
    count > 1
      ? rotateAnim.interpolate({
          inputRange: [0, count],
          outputRange: ['0deg', '-360deg'],
        })
      : '0deg';

  const counterRotation =
    count > 1
      ? rotateAnim.interpolate({
          inputRange: [0, count],
          outputRange: ['0deg', '360deg'],
        })
      : '0deg';

  return (
    <View style={[styles.wrap, { width: dialSize, height: dialSize }]}>
      <View
        style={[
          styles.outerRing,
          { width: dialSize, height: dialSize, borderRadius: dialSize / 2 },
        ]}
      />
      <View
        style={[
          styles.innerRing,
          {
            width: dialSize - 44,
            height: dialSize - 44,
            borderRadius: (dialSize - 44) / 2,
          },
        ]}
      />

      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ rotate: rotation }] }]}
      >
        {districts.map((d, i) => {
          const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
          const x = dialSize / 2 + radiusDist * Math.cos(angle) - 28;
          const y = dialSize / 2 + radiusDist * Math.sin(angle) - 28;
          const isActive = d.id === active;

          return (
            <Animated.View
              key={d.id}
              style={[
                styles.spoke,
                {
                  left: x,
                  top: y,
                  transform: [{ rotate: counterRotation }],
                },
              ]}
            >
              <Pressable
                onPress={() => onChange(d.id)}
                style={[
                  styles.item,
                  {
                    borderColor: isActive ? d.accent : colors.borderSoft,
                    backgroundColor: isActive ? `${d.accent}33` : colors.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.itemEmoji,
                    { color: isActive ? d.accent : colors.textMuted },
                  ]}
                >
                  {d.emoji}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </Animated.View>

      <View
        style={[
          styles.center,
          {
            width: dialSize * 0.4,
            height: dialSize * 0.4,
            borderRadius: (dialSize * 0.4) / 2,
            borderColor: activeDistrict?.accent ?? colors.mustard,
          },
        ]}
      >
        <Text
          style={[
            styles.centerEmoji,
            { color: activeDistrict?.accent ?? colors.mustard },
          ]}
        >
          {activeDistrict?.emoji ?? '◈'}
        </Text>
        <Text style={styles.centerLabel}>
          {activeDistrict?.title ?? 'ALL'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  outerRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderStyle: 'dashed',
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  spoke: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmoji: { fontSize: 22, fontWeight: '900' },
  center: {
    position: 'absolute',
    borderWidth: 2,
    backgroundColor: colors.bgAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerEmoji: { fontSize: 32, fontWeight: '900', marginBottom: 4 },
  centerLabel: {
    color: colors.text,
    fontSize: fontSizes.xs,
    fontWeight: '800',
    letterSpacing: 2,
  },
});

export default RadialDial;