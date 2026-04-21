import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/theme';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const AnimatedBackdrop: React.FC = () => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 5500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 5500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const translate = pulse.interpolate({ inputRange: [0, 1], outputRange: [-60, 60] });
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.85] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        { transform: [{ translateY: translate }, { scale }], opacity },
      ]}
    >
      <AnimatedGradient
        colors={[colors.terracotta, colors.mustard, 'transparent']}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={styles.blob}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: '15%', left: '-25%', right: '-25%', height: '55%' },
  blob: { flex: 1, borderRadius: 999 },
});

export default AnimatedBackdrop;