import React, { useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onboardingData } from '../../data/onboarding';
import { colors, fontSizes, IS_SMALL_SCREEN, radius, spacing } from '../../theme/theme';
import { RootStackParamList } from '../../types';
import { SettingsStorage } from '../../storage/SettingsStorage';
import { useFadeIn } from '../../hooks/useFadeIn';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const slide = onboardingData[index];
  const isLast = index === onboardingData.length - 1;

  const transition = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    transition.setValue(0);
    Animated.timing(transition, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [index, transition]);

  const opacity = transition;
  const translateY = transition.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  const finish = async () => {
    await SettingsStorage.setOnboardingCompleted(true);
    navigation.replace('Main', { screen: 'Atlas' });
  };

  const onNext = () => {
    if (isLast) finish();
    else setIndex(i => i + 1);
  };

  const headerAnim = useFadeIn(0, 500);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.bg, colors.bgAlt, colors.bg]}
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

      <SafeAreaView style={styles.safe}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim.opacity,
              transform: [{ translateY: headerAnim.translateY }],
            },
          ]}
        >
          <View style={styles.guideRow}>
            <View style={styles.guideIconWrap}>
              <Text style={styles.guideIcon}>◈</Text>
            </View>
            <View>
              <Text style={styles.guideKicker}>YOUR GUIDE</Text>
              <Text style={styles.guideName}>Alex</Text>
            </View>
          </View>
          <Pressable hitSlop={10} onPress={finish}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </Animated.View>

        <View style={styles.middle}>
          <Animated.View style={[styles.imgRing, { opacity, transform: [{ translateY }] }]}>
            <View style={styles.ringOuter}>
              <View style={styles.ringInner}>
                <Image source={slide.image} style={styles.image} resizeMode="contain" />
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.textBlock, { opacity, transform: [{ translateY }] }]}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>◇ {slide.tag}</Text>
            </View>

            <Text style={styles.title} numberOfLines={3} adjustsFontSizeToFit>
              {slide.title}
            </Text>

            <View style={styles.messageBox}>
              <View style={styles.bubbleTail} />
              <Text style={styles.messageText}>{slide.message}</Text>
            </View>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {onboardingData.map((_, i) => {
              const active = i === index;
              return (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    active && styles.dotActive,
                    { width: active ? 28 : 6 },
                  ]}
                />
              );
            })}
          </View>

          <Pressable onPress={onNext} style={styles.btn}>
            <LinearGradient
              colors={[colors.terracotta, colors.mustard]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              <Text style={styles.btnText}>
                {isLast ? "LET'S BEGIN" : 'NEXT'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },
  safe: {
    flex: 1,
  },
  decorTopRight: { position: 'absolute', top: -120, right: -120 },
  decorBottomLeft: { position: 'absolute', bottom: -140, left: -140 },
  circle: { width: 280, height: 280, borderRadius: 140 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: 8,
    paddingBottom: spacing.sm,
  },
  guideRow: { flexDirection: 'row', alignItems: 'center' },
  guideIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.mustard,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  guideIcon: { fontSize: 18, color: colors.mustard, fontWeight: '900' },
  guideKicker: { color: colors.mustard, fontSize: 9, fontWeight: '800', letterSpacing: 2 },
  guideName: { color: colors.text, fontSize: fontSizes.md, fontWeight: '800', marginTop: 2 },
  skip: { color: colors.textMuted, fontSize: fontSizes.md, fontWeight: '600' },
  middle: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  imgRing: {
    alignItems: 'center',
    marginBottom: IS_SMALL_SCREEN ? spacing.sm : spacing.md,
  },
  ringOuter: {
    width: IS_SMALL_SCREEN ? 150 : 180,
    height: IS_SMALL_SCREEN ? 150 : 180,
    borderRadius: IS_SMALL_SCREEN ? 75 : 90,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: IS_SMALL_SCREEN ? 125 : 150,
    height: IS_SMALL_SCREEN ? 125 : 150,
    borderRadius: IS_SMALL_SCREEN ? 62 : 75,
    borderWidth: 1.5,
    borderColor: colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  image: {
    width: IS_SMALL_SCREEN ? 96 : 118,
    height: IS_SMALL_SCREEN ? 96 : 118,
  },
  textBlock: {},
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.chipBgMustard,
    borderWidth: 1,
    borderColor: colors.mustard,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: spacing.sm,
  },
  tagText: { color: colors.mustard, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1.2 },
  title: {
    color: colors.text,
    fontSize: IS_SMALL_SCREEN ? fontSizes.lg + 2 : fontSizes.xl + 4,
    fontWeight: '900',
    lineHeight: (IS_SMALL_SCREEN ? fontSizes.lg + 2 : fontSizes.xl + 4) * 1.15,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  messageBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    position: 'relative',
  },
  bubbleTail: {
    position: 'absolute',
    top: -6,
    left: 20,
    width: 12,
    height: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    transform: [{ rotate: '45deg' }],
  },
  messageText: {
    color: colors.textMuted,
    fontSize: IS_SMALL_SCREEN ? fontSizes.sm : fontSizes.md,
    lineHeight: (IS_SMALL_SCREEN ? fontSizes.sm : fontSizes.md) * 1.5,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderSoft,
    marginHorizontal: 3,
  },
  dotActive: { backgroundColor: colors.mustard },
  btn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  btnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  btnText: {
    color: colors.textInk,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
});

export default OnboardingScreen;