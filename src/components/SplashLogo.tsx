import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, IS_SMALL_SCREEN } from '../theme/theme';

const LOGO = require('../assets/image/logo_app.png');

const SplashLogo: React.FC = () => {
  const rotate = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;
  const ringPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),
    ]).start();

    const rotateLoop = Animated.loop(
      Animated.timing(rotate, { toValue: 1, duration: 12000, easing: Easing.linear, useNativeDriver: true }),
    );
    rotateLoop.start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ringPulse, { toValue: 1, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(ringPulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    pulseLoop.start();

    return () => {
      rotateLoop.stop();
      pulseLoop.stop();
    };
  }, [fade, rotate, scale, ringPulse]);

  const rotation = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rotationReverse = rotate.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const pulseScale = ringPulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.6] });
  const pulseOpacity = ringPulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] });

  const logoSize = IS_SMALL_SCREEN ? 140 : 170;
  const ringSize = logoSize + 40;
  const outerSize = logoSize + 90;

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[
          styles.ring,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.outerRing,
          {
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.tick,
              {
                transform: [{ rotate: `${i * 45}deg` }, { translateY: -outerSize / 2 + 4 }],
              },
            ]}
          />
        ))}
      </Animated.View>

      <Animated.View
        style={[
          styles.innerRing,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            transform: [{ rotate: rotationReverse }],
          },
        ]}
      />

      <Animated.View style={{ opacity: fade, transform: [{ scale }] }}>
        <Image source={LOGO} style={{ width: logoSize, height: logoSize }} resizeMode="contain" />
      </Animated.View>


    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.terracotta,
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
  },
  tick: {
    position: 'absolute',
    width: 2,
    height: 8,
    backgroundColor: colors.mustard,
  },
  textWrap: { alignItems: 'center', marginTop: 24 },
  title: { color: colors.text, fontSize: fontSizes.xxl, fontWeight: '900', letterSpacing: 6 },
  divider: { width: 40, height: 2, backgroundColor: colors.mustard, marginVertical: 8 },
  sub: { color: colors.mustard, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 4 },
});

export default SplashLogo;