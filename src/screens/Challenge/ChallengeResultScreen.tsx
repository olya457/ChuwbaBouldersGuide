import React, { useEffect } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlassPanel from '../../components/GlassPanel';
import { colors, fontSizes, IS_SMALL_SCREEN, radius, spacing } from '../../theme/theme';
import { RootStackParamList } from '../../types';
import { SettingsStorage } from '../../storage/SettingsStorage';
import { useFadeIn, useFadeInScale } from '../../hooks/useFadeIn';

type Props = NativeStackScreenProps<RootStackParamList, 'ChallengeResult'>;

const ChallengeResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { score, total, answers, level, isPerfect, hasNextLevel } = route.params;

  useEffect(() => {
    SettingsStorage.clearChallengeProgress();
  }, []);

  const allDone = isPerfect && !hasNextLevel;
  const accuracy = Math.round((score / total) * 100);

  let mark = '◯';
  let title = 'Try Again';
  let subtitle = 'Not quite there yet';
  let messageText = 'A single miss, and the tier resets. Step back, breathe, and take it again.';
  let accent = colors.terracotta;

  if (isPerfect && hasNextLevel) {
    mark = '◆';
    title = 'Tier Cleared';
    subtitle = `Perfect run on tier ${level}`;
    messageText = 'You nailed every answer. The next tier is unlocked and waiting.';
    accent = colors.mustard;
  } else if (allDone) {
    mark = '✦';
    title = 'Grand Master';
    subtitle = 'Every tier conquered';
    messageText = "You've seen it all. Boulder holds no more secrets from you — at least not in this challenge.";
    accent = colors.mustard;
  }

  const headerAnim = useFadeInScale(0, 540);
  const statsAnim = useFadeIn(220, 440);
  const dotsAnim = useFadeIn(340, 420);
  const messageAnim = useFadeIn(460, 420);
  const actionsAnim = useFadeIn(580, 420);

  const onTryAgain = async () => {
    await SettingsStorage.clearChallengeProgress();
    navigation.replace('ChallengeGame', { level });
  };

  const onNextLevel = async () => {
    await SettingsStorage.clearChallengeProgress();
    navigation.replace('ChallengeGame', { level: level + 1 });
  };

  const onHome = async () => {
    await SettingsStorage.clearChallengeProgress();
    navigation.navigate('Main', { screen: 'Challenge' });
  };

  const hasPrimaryBtn = (isPerfect && hasNextLevel) || !isPerfect;
  const primaryBtnLabel = isPerfect && hasNextLevel ? 'NEXT TIER →' : 'TRY AGAIN';
  const primaryBtnHandler = isPerfect && hasNextLevel ? onNextLevel : onTryAgain;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.bg, colors.bgAlt, colors.bg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.decorTopRight}>
        <View style={[styles.circle, { backgroundColor: accent, opacity: 0.1 }]} />
      </View>
      <View style={styles.decorBottomLeft}>
        <View style={[styles.circle, { backgroundColor: colors.mustard, opacity: 0.06 }]} />
      </View>

      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.headerBlock,
              { opacity: headerAnim.opacity, transform: [{ scale: headerAnim.scale }] },
            ]}
          >
            <View style={[styles.markRingOuter, { borderColor: accent }]}>
              <View style={[styles.markRingInner, { borderColor: accent }]}>
                <Text style={[styles.markText, { color: accent }]}>{mark}</Text>
              </View>
            </View>
            <View style={[styles.tierBadge, { borderColor: accent, backgroundColor: `${accent}22` }]}>
              <Text style={[styles.tierBadgeText, { color: accent }]}>
                TIER {level}
              </Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.statsBlock,
              { opacity: statsAnim.opacity, transform: [{ translateY: statsAnim.translateY }] },
            ]}
          >
            <GlassPanel variant="accent" style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.statCell}>
                  <Text style={[styles.statNum, { color: colors.text }]}>{score}</Text>
                  <Text style={styles.statLabel}>CORRECT</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCell}>
                  <Text style={[styles.statNum, { color: colors.terracotta }]}>{total - score}</Text>
                  <Text style={styles.statLabel}>MISSED</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCell}>
                  <Text style={[styles.statNum, { color: colors.mustard }]}>{accuracy}%</Text>
                  <Text style={styles.statLabel}>ACCURACY</Text>
                </View>
              </View>
            </GlassPanel>
          </Animated.View>

          <Animated.View
            style={[
              styles.dotsBlock,
              { opacity: dotsAnim.opacity, transform: [{ translateY: dotsAnim.translateY }] },
            ]}
          >
            <Text style={styles.dotsLabel}>YOUR ANSWERS</Text>
            <View style={styles.dotsRow}>
              {answers.map((ok, i) => (
                <View
                  key={i}
                  style={[
                    styles.answerDot,
                    ok
                      ? { backgroundColor: 'rgba(124,152,133,0.2)', borderColor: colors.success }
                      : { backgroundColor: 'rgba(209,74,92,0.2)', borderColor: colors.danger },
                  ]}
                >
                  <Text style={[styles.answerDotText, { color: ok ? colors.success : colors.danger }]}>
                    {ok ? '◉' : '✕'}
                  </Text>
                  <Text style={styles.answerDotNum}>{i + 1}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.messageBlock,
              { opacity: messageAnim.opacity, transform: [{ translateY: messageAnim.translateY }] },
            ]}
          >
            <GlassPanel style={styles.messageCard}>
              <View style={styles.bubbleTail} />
              <View style={styles.messageInner}>
                <View style={styles.alexAvatar}>
                  <Text style={styles.alexText}>A</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.alexKicker}>ALEX · YOUR GUIDE</Text>
                  <Text style={styles.messageText}>{messageText}</Text>
                </View>
              </View>
            </GlassPanel>
          </Animated.View>
        </ScrollView>

        <Animated.View
          style={[
            styles.footer,
            { opacity: actionsAnim.opacity, transform: [{ translateY: actionsAnim.translateY }] },
          ]}
        >
          {hasPrimaryBtn ? (
            <Pressable style={styles.btn} onPress={primaryBtnHandler}>
              <LinearGradient
                colors={[colors.terracotta, colors.mustard]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                <Text style={styles.btnText}>{primaryBtnLabel}</Text>
              </LinearGradient>
            </Pressable>
          ) : null}

          <Pressable style={styles.homeBtn} onPress={onHome}>
            <Text style={styles.homeText}>Back to Challenge</Text>
          </Pressable>
        </Animated.View>
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
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    flexGrow: 1,
  },
  headerBlock: { alignItems: 'center', marginBottom: spacing.lg },
  markRingOuter: {
    width: IS_SMALL_SCREEN ? 100 : 130,
    height: IS_SMALL_SCREEN ? 100 : 130,
    borderRadius: IS_SMALL_SCREEN ? 50 : 65,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markRingInner: {
    width: IS_SMALL_SCREEN ? 76 : 96,
    height: IS_SMALL_SCREEN ? 76 : 96,
    borderRadius: IS_SMALL_SCREEN ? 38 : 48,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgAlt,
  },
  markText: { fontSize: IS_SMALL_SCREEN ? 36 : 48, fontWeight: '900' },
  tierBadge: {
    marginTop: spacing.md,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  tierBadgeText: { fontSize: fontSizes.xs, fontWeight: '900', letterSpacing: 2 },
  title: {
    color: colors.text,
    fontSize: IS_SMALL_SCREEN ? fontSizes.xxl - 4 : fontSizes.xxl,
    fontWeight: '900',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  subtitle: { color: colors.textMuted, fontSize: fontSizes.sm, marginTop: 4, textAlign: 'center' },
  statsBlock: { marginBottom: spacing.md },
  statsCard: { padding: 14 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statCell: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: IS_SMALL_SCREEN ? fontSizes.xxl - 6 : fontSizes.xxl, fontWeight: '900' },
  statLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 1.3, marginTop: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: colors.borderSoft },
  dotsBlock: { marginBottom: spacing.md },
  dotsLabel: {
    color: colors.mustard,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 10,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  answerDot: {
    width: IS_SMALL_SCREEN ? 40 : 48,
    height: IS_SMALL_SCREEN ? 40 : 48,
    borderRadius: IS_SMALL_SCREEN ? 20 : 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginBottom: 8,
  },
  answerDotText: { fontSize: IS_SMALL_SCREEN ? 14 : 16, fontWeight: '900' },
  answerDotNum: { color: colors.textDim, fontSize: 9, fontWeight: '700', marginTop: 1 },
  messageBlock: { marginBottom: spacing.md },
  messageCard: { padding: 14, position: 'relative' },
  bubbleTail: {
    position: 'absolute',
    top: -6,
    left: 24,
    width: 12,
    height: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    transform: [{ rotate: '45deg' }],
  },
  messageInner: { flexDirection: 'row', alignItems: 'flex-start' },
  alexAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.mustard,
    backgroundColor: colors.chipBgMustard,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alexText: { color: colors.mustard, fontSize: fontSizes.sm, fontWeight: '900' },
  alexKicker: { color: colors.mustard, fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginBottom: 4 },
  messageText: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * 1.5,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
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
  homeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  homeText: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default ChallengeResultScreen;