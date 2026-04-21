import React, { useCallback, useEffect, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../../components/HeaderBar';
import GlassPanel from '../../components/GlassPanel';
import { QUESTIONS_PER_LEVEL, TOTAL_LEVELS } from '../../data/quiz';
import { colors, fontSizes, IS_SMALL_SCREEN, radius, spacing } from '../../theme/theme';
import { RootStackParamList } from '../../types';
import { SettingsStorage } from '../../storage/SettingsStorage';
import { useFadeIn, useFadeInScale } from '../../hooks/useFadeIn';

const TAB_BAR_HEIGHT = 90;

const intros = [
  {
    step: '01',
    title: 'The\nChallenge',
    message: "Greetings, explorer. I'm Alex. Ready to prove how deeply you know Boulder? Each level holds five questions — answer them all to unlock the next tier.",
    button: 'Show me the rules',
  },
  {
    step: '02',
    title: 'The\nRules',
    message: "Four answers. One truth. Fifteen seconds each. Clear every question in a level to move forward — a single wrong answer sends you back to the start of that tier.",
    button: 'Understood',
  },
  {
    step: '03',
    title: 'Ready?',
    message: `${TOTAL_LEVELS} tiers. ${QUESTIONS_PER_LEVEL} questions each. One path to becoming a true Boulder expert.`,
    button: 'Begin',
  },
];

const ChallengeIntroScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(0);
  const [progressInfo, setProgressInfo] = useState<{
    level: number;
    indexInLevel: number;
    score: number;
  } | null>(null);
  const [bestScore, setBestScore] = useState(0);

  const loadProgress = useCallback(async () => {
    const [saved, best] = await Promise.all([
      SettingsStorage.getChallengeProgress(),
      SettingsStorage.getBestScore(),
    ]);
    setBestScore(best);
    if (saved && (saved.indexInLevel > 0 || saved.level > 1)) {
      setProgressInfo({
        level: saved.level,
        indexInLevel: saved.indexInLevel,
        score: saved.score,
      });
    } else {
      setProgressInfo(null);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
      setStep(0);
    }, [loadProgress]),
  );

  const current = intros[step];

  const onNext = () => {
    if (step < intros.length - 1) setStep(s => s + 1);
    else navigation.navigate('ChallengeGame', { level: 1 });
  };

  const onContinue = () => {
    if (progressInfo) navigation.navigate('ChallengeGame', { level: progressInfo.level });
  };

  const onRestart = async () => {
    await SettingsStorage.clearChallengeProgress();
    setProgressInfo(null);
    setStep(0);
  };

  const headerAnim = useFadeIn(0, 420);
  const contentAnim = useFadeInScale(160, 500);
  const bottomAnim = useFadeIn(320, 420);

  const renderContinueMode = () => (
    <>
      <HeaderBar kicker="IN PROGRESS" title="Challenge" />

      <View style={styles.middle}>
        <Animated.View
          style={[
            styles.resumeBlock,
            { opacity: contentAnim.opacity, transform: [{ scale: contentAnim.scale }] },
          ]}
        >
          <View style={styles.medallion}>
            <Text style={styles.medallionText}>◆</Text>
          </View>
          <Text style={styles.resumeTitle}>Continue where you left off?</Text>

          <GlassPanel variant="accent" style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>TIER</Text>
              <Text style={styles.progressValue}>
                {progressInfo!.level} <Text style={styles.progressOf}>/ {TOTAL_LEVELS}</Text>
              </Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>QUESTION</Text>
              <Text style={styles.progressValue}>
                {progressInfo!.indexInLevel + 1}{' '}
                <Text style={styles.progressOf}>of {QUESTIONS_PER_LEVEL}</Text>
              </Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>CURRENT SCORE</Text>
              <Text style={[styles.progressValue, { color: colors.mustard }]}>
                ◆ {progressInfo!.score}
              </Text>
            </View>
          </GlassPanel>

          <Text style={styles.resumeNote}>
            Your progress was saved. Tap continue to pick up, or start over from tier one.
          </Text>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.footer,
          { opacity: bottomAnim.opacity, transform: [{ translateY: bottomAnim.translateY }] },
        ]}
      >
        <Pressable onPress={onContinue} style={styles.btn}>
          <LinearGradient
            colors={[colors.terracotta, colors.mustard]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>CONTINUE</Text>
          </LinearGradient>
        </Pressable>
        <Pressable onPress={onRestart} style={styles.restartBtn}>
          <Text style={styles.restartText}>Start Over</Text>
        </Pressable>
      </Animated.View>
    </>
  );

  const renderIntroMode = () => (
    <>
      <HeaderBar
        kicker="TEST YOUR KNOWLEDGE"
        title="Challenge"
        right={
          bestScore > 0 ? (
            <View style={styles.bestPill}>
              <Text style={styles.bestPillText}>◆ {bestScore}</Text>
            </View>
          ) : undefined
        }
      />

      <View style={styles.middle}>
        <Animated.View
          style={[
            styles.stepperRow,
            { opacity: headerAnim.opacity, transform: [{ translateY: headerAnim.translateY }] },
          ]}
        >
          {intros.map((_, i) => (
            <View key={i} style={styles.stepperCell}>
              <View
                style={[
                  styles.stepperDot,
                  i <= step && { backgroundColor: colors.mustard, borderColor: colors.mustard },
                ]}
              >
                <Text
                  style={[
                    styles.stepperDotText,
                    i <= step && { color: colors.textInk },
                  ]}
                >
                  {i + 1}
                </Text>
              </View>
              {i < intros.length - 1 ? (
                <View
                  style={[
                    styles.stepperLine,
                    i < step && { backgroundColor: colors.mustard },
                  ]}
                />
              ) : null}
            </View>
          ))}
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <Animated.View
            key={step}
            style={[
              styles.introBlock,
              { opacity: contentAnim.opacity, transform: [{ scale: contentAnim.scale }] },
            ]}
          >
            <Text style={styles.stepTag}>STEP · {current.step}</Text>
            <Text style={styles.introTitle}>{current.title}</Text>
            <View style={styles.divider} />
            <GlassPanel style={styles.messageCard}>
              <Text style={styles.introMessage}>{current.message}</Text>
            </GlassPanel>
          </Animated.View>
        </ScrollView>
      </View>

      <Animated.View
        style={[
          styles.footer,
          { opacity: bottomAnim.opacity, transform: [{ translateY: bottomAnim.translateY }] },
        ]}
      >
        <Pressable onPress={onNext} style={styles.btn}>
          <LinearGradient
            colors={[colors.terracotta, colors.mustard]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>{current.button.toUpperCase()}</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </>
  );

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
        {progressInfo ? renderContinueMode() : renderIntroMode()}
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
  middle: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: 6,
    paddingBottom: 20,
    flexGrow: 1,
  },
  bestPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.mustard,
    backgroundColor: colors.chipBgMustard,
  },
  bestPillText: { color: colors.mustard, fontSize: fontSizes.sm, fontWeight: '900' },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  stepperCell: { flexDirection: 'row', alignItems: 'center' },
  stepperDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperDotText: { color: colors.textMuted, fontSize: fontSizes.xs, fontWeight: '900' },
  stepperLine: { width: 36, height: 1, backgroundColor: colors.borderSoft, marginHorizontal: 6 },
  introBlock: { alignItems: 'center', paddingTop: spacing.md },
  stepTag: {
    color: colors.terracotta,
    fontSize: fontSizes.xs,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: spacing.md,
  },
  introTitle: {
    color: colors.text,
    fontSize: IS_SMALL_SCREEN ? fontSizes.xxl - 4 : fontSizes.display - 4,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: (IS_SMALL_SCREEN ? fontSizes.xxl - 4 : fontSizes.display - 4) * 1.1,
    letterSpacing: 0.5,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: colors.mustard,
    marginVertical: spacing.lg,
  },
  messageCard: { alignSelf: 'stretch' },
  introMessage: {
    color: colors.textMuted,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * 1.6,
    textAlign: 'center',
  },
  resumeBlock: { alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  medallion: {
    width: IS_SMALL_SCREEN ? 80 : 100,
    height: IS_SMALL_SCREEN ? 80 : 100,
    borderRadius: IS_SMALL_SCREEN ? 40 : 50,
    borderWidth: 2,
    borderColor: colors.mustard,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBgMustard,
    marginBottom: spacing.md,
  },
  medallionText: { color: colors.mustard, fontSize: IS_SMALL_SCREEN ? 36 : 48, fontWeight: '900' },
  resumeTitle: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  progressCard: { alignSelf: 'stretch', padding: 16 },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  progressLabel: { color: colors.textMuted, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1.2 },
  progressValue: { color: colors.text, fontSize: fontSizes.md, fontWeight: '900' },
  progressOf: { color: colors.textMuted, fontSize: fontSizes.sm, fontWeight: '700' },
  progressDivider: { height: 1, backgroundColor: colors.borderSoft, marginVertical: 8 },
  resumeNote: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: fontSizes.sm * 1.5,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: TAB_BAR_HEIGHT,
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
  restartBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  restartText: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default ChallengeIntroScreen;