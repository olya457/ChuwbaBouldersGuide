import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import ScreenFrame from '../../components/ScreenFrame';
import GlassPanel from '../../components/GlassPanel';
import {
  CHALLENGE_TIME_PER_QUESTION,
  QUESTIONS_PER_LEVEL,
  TOTAL_LEVELS,
  challengeQuestions,
} from '../../data/quiz';
import { colors, fontSizes, IS_SMALL_SCREEN, radius, spacing } from '../../theme/theme';
import { RootStackParamList } from '../../types';
import { SettingsStorage } from '../../storage/SettingsStorage';
import { useAppInsets } from '../../hooks/useInsets';
import { useFadeIn } from '../../hooks/useFadeIn';

const AUTO_ADVANCE_DELAY = 1400;

type GameRoute = RouteProp<RootStackParamList, 'ChallengeGame'>;

const ChallengeGameScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<GameRoute>();
  const insets = useAppInsets();

  const paramsLevel = route.params?.level;

  const [level, setLevel] = useState(paramsLevel ?? 1);
  const [indexInLevel, setIndexInLevel] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_TIME_PER_QUESTION);
  const [loaded, setLoaded] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const levelStartIndex = (level - 1) * QUESTIONS_PER_LEVEL;
  const globalIndex = levelStartIndex + indexInLevel;
  const q = challengeQuestions[globalIndex];
  const isLastInLevel = indexInLevel === QUESTIONS_PER_LEVEL - 1;
  const locked = selected !== null;
  const correct = locked && q && selected === q.correctIndex;

  useEffect(() => {
    (async () => {
      const saved = await SettingsStorage.getChallengeProgress();
      if (paramsLevel && paramsLevel !== saved?.level) {
        setLevel(paramsLevel);
        setIndexInLevel(0);
        setScore(0);
        setAnswers([]);
      } else if (saved && saved.level >= 1 && saved.level <= TOTAL_LEVELS) {
        setLevel(saved.level);
        setIndexInLevel(saved.indexInLevel);
        setScore(saved.score);
        setAnswers(saved.answers);
      }
      setLoaded(true);
    })();
  }, [paramsLevel]);

  useEffect(() => {
    if (!loaded || !q) return;
    setTimeLeft(CHALLENGE_TIME_PER_QUESTION);
    setSelected(null);
    progress.setValue(0);
    cardAnim.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: CHALLENGE_TIME_PER_QUESTION * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setSelected(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, [indexInLevel, level, loaded, progress, cardAnim, q]);

  const finishLevel = async (finalScore: number, finalAnswers: boolean[]) => {
    const isPerfect = finalScore === QUESTIONS_PER_LEVEL;
    const hasNextLevel = level < TOTAL_LEVELS;
    await SettingsStorage.clearChallengeProgress();
    const bestSaved = await SettingsStorage.getBestScore();
    if (finalScore > bestSaved) await SettingsStorage.setBestScore(finalScore);

    navigation.replace('ChallengeResult', {
      score: finalScore,
      total: QUESTIONS_PER_LEVEL,
      answers: finalAnswers,
      level,
      isPerfect,
      hasNextLevel,
    });
  };

  const goNextQuestion = async (nextScore: number, nextAnswers: boolean[]) => {
    if (isLastInLevel) {
      await finishLevel(nextScore, nextAnswers);
    } else {
      const nextIdx = indexInLevel + 1;
      await SettingsStorage.setChallengeProgress({
        level,
        indexInLevel: nextIdx,
        score: nextScore,
        answers: nextAnswers,
      });
      setIndexInLevel(nextIdx);
    }
  };

  const onSelect = (i: number) => {
    if (locked || !q) return;
    setSelected(i);
    const isCorrect = i === q.correctIndex;
    const nextScore = isCorrect ? score + 1 : score;
    const nextAnswers = [...answers, isCorrect];
    if (isCorrect) setScore(nextScore);
    setAnswers(nextAnswers);

    if (isCorrect) {
      autoAdvanceRef.current = setTimeout(() => goNextQuestion(nextScore, nextAnswers), AUTO_ADVANCE_DELAY);
    }
  };

  const onNext = () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    goNextQuestion(score, answers);
  };

  const onQuit = async () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    if (indexInLevel > 0 || answers.length > 0 || level > 1) {
      await SettingsStorage.setChallengeProgress({ level, indexInLevel, score, answers });
    }
    navigation.goBack();
  };

  const topAnim = useFadeIn(0, 360);

  if (!loaded || !q) {
    return (
      <ScreenFrame>
        <View />
      </ScreenFrame>
    );
  }

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const cardOpacity = cardAnim;
  const cardTranslate = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

  const difficultyColor =
    q.difficulty === 'hard' ? colors.terracotta : q.difficulty === 'medium' ? colors.mustard : colors.sage;

  return (
    <ScreenFrame contentPaddingTop={false}>
      <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
        <Animated.View
          style={[
            styles.topBar,
            { opacity: topAnim.opacity, transform: [{ translateY: topAnim.translateY }] },
          ]}
        >
          <Pressable onPress={onQuit} hitSlop={10} style={styles.quitBtn}>
            <Text style={styles.quitText}>← QUIT</Text>
          </Pressable>
          <View style={styles.tierPill}>
            <Text style={styles.tierText}>TIER {level}/{TOTAL_LEVELS}</Text>
          </View>
          <View style={styles.scorePill}>
            <Text style={styles.scoreText}>◆ {score}</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.timerWrap,
            { opacity: topAnim.opacity, transform: [{ translateY: topAnim.translateY }] },
          ]}
        >
          <View style={styles.timerRow}>
            <Text style={styles.timerLabel}>
              QUESTION <Text style={{ color: colors.text }}>{indexInLevel + 1}</Text>
              <Text style={{ color: colors.textDim }}> / {QUESTIONS_PER_LEVEL}</Text>
            </Text>
            <Text style={[styles.timerValue, timeLeft <= 5 && { color: colors.terracotta }]}>
              {timeLeft}s
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
              <LinearGradient
                colors={[colors.terracotta, colors.mustard]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <Animated.View style={{ opacity: cardOpacity, transform: [{ translateY: cardTranslate }] }}>
            <GlassPanel variant="strong" style={styles.qCard}>
              <View style={styles.qHeader}>
                <View style={[styles.difficultyPill, { borderColor: difficultyColor, backgroundColor: `${difficultyColor}22` }]}>
                  <Text style={[styles.difficultyText, { color: difficultyColor }]}>
                    ◆ {q.difficulty.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.qNumber}>
                  Q{String(indexInLevel + 1).padStart(2, '0')}
                </Text>
              </View>
              <Text style={styles.qText}>{q.question}</Text>
            </GlassPanel>

            <View style={styles.options}>
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrectOpt = locked && i === q.correctIndex;
                const isWrongOpt = locked && isSelected && i !== q.correctIndex;
                let borderColor = colors.borderSoft;
                let bg = colors.surface;
                const textColor = colors.text;
                if (isCorrectOpt) {
                  borderColor = colors.success;
                  bg = 'rgba(124,152,133,0.15)';
                }
                if (isWrongOpt) {
                  borderColor = colors.danger;
                  bg = 'rgba(196,88,74,0.15)';
                }

                return (
                  <Pressable
                    key={i}
                    style={[styles.option, { borderColor, backgroundColor: bg }]}
                    onPress={() => onSelect(i)}
                    disabled={locked}
                  >
                    <View
                      style={[
                        styles.optionLetter,
                        {
                          borderColor,
                          backgroundColor: isCorrectOpt
                            ? colors.success
                            : isWrongOpt
                            ? colors.danger
                            : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionLetterText,
                          {
                            color:
                              isCorrectOpt || isWrongOpt ? colors.textInk : colors.textMuted,
                          },
                        ]}
                      >
                        {String.fromCharCode(65 + i)}
                      </Text>
                    </View>
                    <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>

        {locked ? (
          <View style={styles.feedbackWrap}>
            <View
              style={[
                styles.feedback,
                correct
                  ? { backgroundColor: 'rgba(124,152,133,0.18)', borderColor: colors.success }
                  : { backgroundColor: 'rgba(196,88,74,0.18)', borderColor: colors.danger },
              ]}
            >
              <Text style={[styles.feedbackIcon, { color: correct ? colors.success : colors.danger }]}>
                {correct ? '◉' : '✕'}
              </Text>
              <Text style={styles.feedbackText}>
                {correct ? 'Correct!' : 'Not this time'}
              </Text>
            </View>

            {!correct ? (
              <Pressable onPress={onNext} style={styles.nextBtn}>
                <LinearGradient
                  colors={[colors.terracotta, colors.mustard]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextBtnGradient}
                >
                  <Text style={styles.nextBtnText}>
                    {isLastInLevel ? 'FINISH TIER →' : 'NEXT →'}
                  </Text>
                </LinearGradient>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </ScreenFrame>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  quitBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  quitText: { color: colors.textMuted, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1 },
  tierPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.mustard,
    backgroundColor: colors.chipBgMustard,
  },
  tierText: { color: colors.mustard, fontSize: fontSizes.xs, fontWeight: '900', letterSpacing: 1.5 },
  scorePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.terracotta,
    backgroundColor: colors.chipBg,
  },
  scoreText: { color: colors.terracotta, fontSize: fontSizes.xs, fontWeight: '900' },
  timerWrap: { marginBottom: spacing.md },
  timerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  timerLabel: { color: colors.textMuted, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1 },
  timerValue: { color: colors.mustard, fontSize: fontSizes.sm, fontWeight: '900' },
  progressTrack: {
    height: 4,
    backgroundColor: colors.borderSoft,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2, overflow: 'hidden' },
  scroll: { paddingBottom: 4, flexGrow: 1 },
  qCard: { padding: IS_SMALL_SCREEN ? 16 : 20, marginBottom: spacing.md },
  qHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  difficultyPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  difficultyText: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  qNumber: { color: colors.textDim, fontSize: fontSizes.sm, fontWeight: '900', letterSpacing: 1.5 },
  qText: {
    color: colors.text,
    fontSize: IS_SMALL_SCREEN ? fontSizes.md : fontSizes.lg,
    fontWeight: '800',
    lineHeight: (IS_SMALL_SCREEN ? fontSizes.md : fontSizes.lg) * 1.4,
  },
  options: {},
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: IS_SMALL_SCREEN ? 10 : 12,
    marginBottom: 10,
  },
  optionLetter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionLetterText: { fontSize: fontSizes.sm, fontWeight: '900' },
  optionText: { flex: 1, fontSize: fontSizes.md, fontWeight: '600' },
  feedbackWrap: { marginTop: 4 },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: IS_SMALL_SCREEN ? 10 : 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  feedbackIcon: { fontSize: 22, fontWeight: '900', marginRight: 10 },
  feedbackText: { color: colors.text, fontSize: fontSizes.lg, fontWeight: '900', letterSpacing: 0.5 },
  nextBtn: { borderRadius: radius.pill, overflow: 'hidden', height: IS_SMALL_SCREEN ? 50 : 56 },
  nextBtnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  nextBtnText: { color: colors.textInk, fontSize: fontSizes.md, fontWeight: '900', letterSpacing: 1.5 },
});

export default ChallengeGameScreen;