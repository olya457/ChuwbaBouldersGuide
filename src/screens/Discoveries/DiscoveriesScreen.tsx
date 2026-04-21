import React, { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenFrame from '../../components/ScreenFrame';
import HeaderBar from '../../components/HeaderBar';
import GlassPanel from '../../components/GlassPanel';
import PillNav from '../../components/PillNav';
import { discoveryCategories, discoveriesData } from '../../data/facts';
import { Discovery, DiscoveryCategory } from '../../types';
import { colors, fontSizes, IS_SMALL_SCREEN, radius, SCREEN_WIDTH, spacing } from '../../theme/theme';
import { useCollection } from '../../storage/CollectionContext';
import { useFadeIn, useFadeInScale } from '../../hooks/useFadeIn';

const SWIPE_THRESHOLD = 120;
const CARD_WIDTH = Math.min(SCREEN_WIDTH - spacing.xl * 2, 360);
const CARD_HEIGHT = IS_SMALL_SCREEN ? 360 : 420;

const DiscoveriesScreen: React.FC = () => {
  const { markDiscoverySeen, discoveriesSeen } = useCollection();
  const [category, setCategory] = useState<DiscoveryCategory>('intelligence');
  const [index, setIndex] = useState(0);
  const [knownInSession, setKnownInSession] = useState<string[]>([]);
  const [newInSession, setNewInSession] = useState<string[]>([]);

  const cards = useMemo(
    () => discoveriesData.filter(f => f.category === category),
    [category],
  );

  const pan = useRef(new Animated.ValueXY()).current;
  const nextCardScale = useRef(new Animated.Value(0.94)).current;

  const current = cards[index];
  const next = cards[index + 1];
  const isDeckFinished = index >= cards.length;

  const headerAnim = useFadeIn(0, 420);
  const switchAnim = useFadeIn(120, 420);
  const cardAnim = useFadeInScale(220, 460);

  const resetSession = () => {
    setIndex(0);
    setKnownInSession([]);
    setNewInSession([]);
    pan.setValue({ x: 0, y: 0 });
    nextCardScale.setValue(0.94);
  };

  React.useEffect(() => {
    resetSession();
  }, [category]);

  const finishCard = (dir: 'left' | 'right') => {
    if (!current) return;
    if (dir === 'right') setKnownInSession(prev => [...prev, current.id]);
    else setNewInSession(prev => [...prev, current.id]);
    markDiscoverySeen(current.id);

    Animated.timing(pan, {
      toValue: { x: dir === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100, y: 0 },
      duration: 260,
      useNativeDriver: false,
    }).start(() => {
      pan.setValue({ x: 0, y: 0 });
      nextCardScale.setValue(0.94);
      setIndex(i => i + 1);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6,
      onPanResponderMove: (_, g) => {
        pan.setValue({ x: g.dx, y: g.dy * 0.3 });
        const prog = Math.min(Math.abs(g.dx) / SWIPE_THRESHOLD, 1);
        nextCardScale.setValue(0.94 + prog * 0.06);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) {
          finishCard('right');
        } else if (g.dx < -SWIPE_THRESHOLD) {
          finishCard('left');
        } else {
          Animated.parallel([
            Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }),
            Animated.spring(nextCardScale, { toValue: 0.94, useNativeDriver: false }),
          ]).start();
        }
      },
    }),
  ).current;

  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const knownOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const newOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const totalSeen = useMemo(
    () => cards.filter(c => discoveriesSeen.includes(c.id)).length,
    [cards, discoveriesSeen],
  );

  return (
    <ScreenFrame withTabBarSpace>
      <HeaderBar
        kicker="SWIPE TO EXPLORE"
        title="Wonders"
        right={
          <View style={styles.progressPill}>
            <Text style={styles.progressText}>
              {totalSeen}<Text style={styles.progressTotal}>/{cards.length}</Text>
            </Text>
          </View>
        }
      />

      <Animated.View
        style={[
          styles.switchWrap,
          { opacity: switchAnim.opacity, transform: [{ translateY: switchAnim.translateY }] },
        ]}
      >
        <PillNav
          items={discoveryCategories.map(c => ({ key: c.id, label: c.title, emoji: c.emoji }))}
          active={category}
          onSelect={k => setCategory(k as DiscoveryCategory)}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.hintRow,
          { opacity: headerAnim.opacity, transform: [{ translateY: headerAnim.translateY }] },
        ]}
      >
        <View style={styles.hintItem}>
          <Text style={styles.hintIconLeft}>←</Text>
          <Text style={styles.hintLabel}>NEW TO ME</Text>
        </View>
        <View style={styles.hintDivider} />
        <View style={styles.hintItem}>
          <Text style={styles.hintLabel}>I KNEW IT</Text>
          <Text style={styles.hintIconRight}>→</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.deckWrap,
          { opacity: cardAnim.opacity, transform: [{ scale: cardAnim.scale }] },
        ]}
      >
        {isDeckFinished ? (
          <GlassPanel variant="accent" style={styles.finishCard}>
            <Text style={styles.finishEmoji}>✦</Text>
            <Text style={styles.finishTitle}>Deck Complete</Text>
            <View style={styles.finishStats}>
              <View style={styles.finishStatCell}>
                <Text style={[styles.finishStatNum, { color: colors.mustard }]}>
                  {knownInSession.length}
                </Text>
                <Text style={styles.finishStatLabel}>YOU KNEW</Text>
              </View>
              <View style={styles.finishDivider} />
              <View style={styles.finishStatCell}>
                <Text style={[styles.finishStatNum, { color: colors.terracotta }]}>
                  {newInSession.length}
                </Text>
                <Text style={styles.finishStatLabel}>NEW FACTS</Text>
              </View>
            </View>
            <Text style={styles.finishText}>
              You've gone through every wonder in this category. Swap the category above or run it again.
            </Text>
            <Pressable style={styles.resetBtn} onPress={resetSession}>
              <LinearGradient
                colors={[colors.terracotta, colors.mustard]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.resetBtnGradient}
              >
                <Text style={styles.resetBtnText}>RUN AGAIN</Text>
              </LinearGradient>
            </Pressable>
          </GlassPanel>
        ) : (
          <View style={styles.deckStack}>
            {next ? (
              <Animated.View
                style={[
                  styles.card,
                  styles.cardBehind,
                  { transform: [{ scale: nextCardScale }] },
                ]}
              >
                <CardContent discovery={next} faded />
              </Animated.View>
            ) : null}

            {current ? (
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.card,
                  {
                    transform: [
                      { translateX: pan.x },
                      { translateY: pan.y },
                      { rotate },
                    ],
                  },
                ]}
              >
                <CardContent discovery={current} />
                <Animated.View style={[styles.badgeRight, { opacity: knownOpacity }]}>
                  <Text style={styles.badgeTextKnown}>✓ I KNEW</Text>
                </Animated.View>
                <Animated.View style={[styles.badgeLeft, { opacity: newOpacity }]}>
                  <Text style={styles.badgeTextNew}>✦ NEW</Text>
                </Animated.View>
              </Animated.View>
            ) : null}
          </View>
        )}
      </Animated.View>

      {!isDeckFinished && current ? (
        <View style={styles.btnRow}>
          <Pressable style={[styles.btn, styles.btnNew]} onPress={() => finishCard('left')}>
            <Text style={styles.btnNewIcon}>←</Text>
            <Text style={styles.btnNewText}>NEW</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnKnown]} onPress={() => finishCard('right')}>
            <Text style={styles.btnKnownText}>KNEW</Text>
            <Text style={styles.btnKnownIcon}>→</Text>
          </Pressable>
        </View>
      ) : null}
    </ScreenFrame>
  );
};

interface CardContentProps {
  discovery: Discovery;
  faded?: boolean;
}

const CardContent: React.FC<CardContentProps> = ({ discovery, faded }) => {
  return (
    <View style={[styles.cardInner, faded && { opacity: 0.5 }]}>
      <View style={styles.cardTop}>
        <View style={styles.iconRing}>
          <Text style={styles.cardEmoji}>{discovery.icon}</Text>
        </View>
        <View style={styles.cardNum}>
          <Text style={styles.cardNumText}>
            {discovery.category.slice(0, 3).toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.cardTitle}>{discovery.title}</Text>
      <View style={styles.cardDivider} />
      <Text style={styles.cardText}>{discovery.description}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>BOULDER · CO</Text>
        <View style={styles.footerLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.mustard,
    backgroundColor: colors.chipBgMustard,
  },
  progressText: { color: colors.mustard, fontSize: fontSizes.sm, fontWeight: '900' },
  progressTotal: { color: colors.textMuted, fontSize: fontSizes.xs, fontWeight: '700' },
  switchWrap: { paddingHorizontal: spacing.xl, marginBottom: IS_SMALL_SCREEN ? 8 : 12 },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  hintItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  hintIconLeft: { color: colors.terracotta, fontSize: 16, fontWeight: '900', marginRight: 6 },
  hintIconRight: { color: colors.mustard, fontSize: 16, fontWeight: '900', marginLeft: 6 },
  hintLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  hintDivider: { width: 1, height: 14, backgroundColor: colors.borderSoft, marginHorizontal: 8 },
  deckWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  deckStack: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: radius.xl,
    backgroundColor: colors.bgAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: IS_SMALL_SCREEN ? 18 : 22,
    overflow: 'hidden',
  },
  cardBehind: { borderColor: colors.borderSoft },
  cardInner: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconRing: {
    width: IS_SMALL_SCREEN ? 54 : 64,
    height: IS_SMALL_SCREEN ? 54 : 64,
    borderRadius: IS_SMALL_SCREEN ? 27 : 32,
    borderWidth: 2,
    borderColor: colors.mustard,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBgMustard,
  },
  cardEmoji: { fontSize: IS_SMALL_SCREEN ? 24 : 30 },
  cardNum: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.terracotta,
    backgroundColor: colors.chipBg,
  },
  cardNumText: { color: colors.terracotta, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  cardTitle: {
    color: colors.text,
    fontSize: IS_SMALL_SCREEN ? fontSizes.md + 2 : fontSizes.lg + 2,
    fontWeight: '900',
    marginTop: spacing.md,
    lineHeight: (IS_SMALL_SCREEN ? fontSizes.md + 2 : fontSizes.lg + 2) * 1.2,
  },
  cardDivider: {
    height: 2,
    backgroundColor: colors.mustard,
    width: 40,
    marginTop: 10,
    marginBottom: 10,
  },
  cardText: {
    color: colors.textMuted,
    fontSize: IS_SMALL_SCREEN ? fontSizes.sm : fontSizes.md,
    lineHeight: (IS_SMALL_SCREEN ? fontSizes.sm : fontSizes.md) * 1.55,
    flex: 1,
  },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  footerLine: { flex: 1, height: 1, backgroundColor: colors.borderSoft },
  footerText: {
    color: colors.textDim,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginHorizontal: 10,
  },
  badgeRight: {
    position: 'absolute',
    top: 30,
    left: 22,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 3,
    borderColor: colors.mustard,
    transform: [{ rotate: '-18deg' }],
    backgroundColor: 'rgba(245,184,78,0.15)',
  },
  badgeTextKnown: { color: colors.mustard, fontSize: fontSizes.md, fontWeight: '900', letterSpacing: 2 },
  badgeLeft: {
    position: 'absolute',
    top: 30,
    right: 22,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 3,
    borderColor: colors.terracotta,
    transform: [{ rotate: '18deg' }],
    backgroundColor: 'rgba(233,98,140,0.15)',
  },
  badgeTextNew: { color: colors.terracotta, fontSize: fontSizes.md, fontWeight: '900', letterSpacing: 2 },
  btnRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: IS_SMALL_SCREEN ? 12 : 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    marginHorizontal: 4,
  },
  btnNew: { borderColor: colors.terracotta, backgroundColor: colors.chipBg },
  btnKnown: { borderColor: colors.mustard, backgroundColor: colors.chipBgMustard },
  btnNewIcon: { color: colors.terracotta, fontSize: 16, fontWeight: '900', marginRight: 6 },
  btnNewText: { color: colors.terracotta, fontSize: fontSizes.sm, fontWeight: '900', letterSpacing: 1.5 },
  btnKnownIcon: { color: colors.mustard, fontSize: 16, fontWeight: '900', marginLeft: 6 },
  btnKnownText: { color: colors.mustard, fontSize: fontSizes.sm, fontWeight: '900', letterSpacing: 1.5 },
  finishCard: {
    width: CARD_WIDTH,
    alignItems: 'center',
    padding: IS_SMALL_SCREEN ? 20 : 28,
  },
  finishEmoji: { fontSize: IS_SMALL_SCREEN ? 48 : 64, color: colors.mustard, marginBottom: 8 },
  finishTitle: { color: colors.text, fontSize: fontSizes.xl, fontWeight: '900', marginBottom: spacing.md },
  finishStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  finishStatCell: { alignItems: 'center', paddingHorizontal: 20 },
  finishStatNum: { fontSize: IS_SMALL_SCREEN ? 30 : 40, fontWeight: '900' },
  finishStatLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: 4 },
  finishDivider: { width: 1, height: 40, backgroundColor: colors.borderSoft },
  finishText: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    textAlign: 'center',
    lineHeight: fontSizes.sm * 1.5,
    marginBottom: spacing.lg,
  },
  resetBtn: { alignSelf: 'stretch', borderRadius: radius.pill, overflow: 'hidden', height: 50 },
  resetBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: { color: colors.textInk, fontSize: fontSizes.sm, fontWeight: '900', letterSpacing: 2 },
});

export default DiscoveriesScreen;