import React, { useMemo, useState } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenFrame from '../../components/ScreenFrame';
import HeaderBar from '../../components/HeaderBar';
import ProgressRing from '../../components/ProgressRing';
import StampBadge from '../../components/StampBadge';
import GlassPanel from '../../components/GlassPanel';
import { artifactsData } from '../../data/locations';
import { districts } from '../../data/districts';
import { Artifact, RootStackParamList } from '../../types';
import { colors, districtColors, fontSizes, IS_SMALL_SCREEN, radius, SCREEN_WIDTH, spacing } from '../../theme/theme';
import { useCollection } from '../../storage/CollectionContext';
import { useFadeIn } from '../../hooks/useFadeIn';

type Mode = 'collected' | 'all';

const CollectionScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { collected, visited } = useCollection();
  const [mode, setMode] = useState<Mode>('all');
  const [activeDist, setActiveDist] = useState<string>('all');

  const filtered = useMemo(() => {
    return artifactsData.filter(a => {
      const byDist = activeDist === 'all' || a.district === activeDist;
      const byMode = mode === 'all' || collected.includes(a.id);
      return byDist && byMode;
    });
  }, [activeDist, mode, collected]);

  const districtStats = useMemo(() => {
    return districts
      .filter(d => d.id !== 'all')
      .map(d => {
        const all = artifactsData.filter(a => a.district === d.id);
        const got = all.filter(a => collected.includes(a.id));
        return { id: d.id, title: d.title, emoji: d.emoji, accent: d.accent, got: got.length, total: all.length };
      });
  }, [collected]);

  const headerAnim = useFadeIn(0, 420);
  const ringAnim = useFadeIn(120, 440);
  const statsAnim = useFadeIn(240, 440);
  const filterAnim = useFadeIn(320, 420);

  const renderStamp = ({ item, index }: { item: Artifact; index: number }) => {
    const earned = collected.includes(item.id);
    const wasVisited = visited.includes(item.id);
    const accent = districtColors[item.district] ?? colors.terracotta;
    const letter = item.title.charAt(0);

    return (
      <Pressable
        style={styles.stampCell}
        onPress={() => navigation.navigate('ArtifactDetail', { artifactId: item.id })}
      >
        <StampBadge
          letter={letter}
          color={accent}
          earned={earned}
          rarity={item.rarity}
          size={IS_SMALL_SCREEN ? 68 : 78}
          delay={index * 40}
        />
        <Text style={[styles.stampTitle, earned && { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        {wasVisited && !earned ? (
          <View style={styles.seenDot}>
            <Text style={styles.seenDotText}>seen</Text>
          </View>
        ) : null}
      </Pressable>
    );
  };

  return (
 <ScreenFrame withTabBarSpace>
      <HeaderBar kicker="YOUR TROPHIES" title="Collection" />

      <Animated.View
        style={[
          styles.topRow,
          { opacity: ringAnim.opacity, transform: [{ translateY: ringAnim.translateY }] },
        ]}
      >
        <ProgressRing
          value={collected.length}
          total={artifactsData.length}
          size={IS_SMALL_SCREEN ? 110 : 130}
          label="STAMPS"
        />
        <View style={styles.topTextBox}>
          <Text style={styles.topKicker}>BOULDER EXPLORER</Text>
          <Text style={styles.topTitle}>
            {collected.length === 0
              ? 'Start collecting'
              : collected.length === artifactsData.length
              ? 'Legendary!'
              : `${artifactsData.length - collected.length} to go`}
          </Text>
          <Text style={styles.topSub}>
            You've visited {visited.length} of {artifactsData.length} places.
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.statsRow,
          { opacity: statsAnim.opacity, transform: [{ translateY: statsAnim.translateY }] },
        ]}
      >
        {districtStats.map(s => (
          <View key={s.id} style={styles.statCell}>
            <View style={[styles.statDot, { backgroundColor: s.accent }]} />
            <Text style={styles.statLabel}>{s.title}</Text>
            <Text style={styles.statValue}>
              {s.got}
              <Text style={styles.statTotal}>/{s.total}</Text>
            </Text>
          </View>
        ))}
      </Animated.View>

      <Animated.View
        style={[
          styles.filterBar,
          { opacity: filterAnim.opacity, transform: [{ translateY: filterAnim.translateY }] },
        ]}
      >
        <View style={styles.modeSwitch}>
          <Pressable
            style={[styles.modeBtn, mode === 'all' && styles.modeBtnActive]}
            onPress={() => setMode('all')}
          >
            <Text style={[styles.modeText, mode === 'all' && styles.modeTextActive]}>All</Text>
          </Pressable>
          <Pressable
            style={[styles.modeBtn, mode === 'collected' && styles.modeBtnActive]}
            onPress={() => setMode('collected')}
          >
            <Text style={[styles.modeText, mode === 'collected' && styles.modeTextActive]}>
              Earned
            </Text>
          </Pressable>
        </View>

        <View style={styles.districtRow}>
          {districts.map(d => {
            const isActive = activeDist === d.id;
            return (
              <Pressable
                key={d.id}
                style={[
                  styles.districtChip,
                  isActive && { borderColor: d.accent, backgroundColor: `${d.accent}22` },
                ]}
                onPress={() => setActiveDist(d.id)}
              >
                <Text style={[styles.districtChipText, isActive && { color: d.accent }]}>
                  {d.emoji}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderStamp}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <GlassPanel style={styles.empty}>
            <Text style={styles.emptyIcon}>◯</Text>
            <Text style={styles.emptyTitle}>No stamps here yet</Text>
            <Text style={styles.emptyText}>
              {mode === 'collected'
                ? 'Collect artifacts from the Atlas to fill this space'
                : 'Try a different district filter'}
            </Text>
          </GlassPanel>
        }
      />
    </ScreenFrame>
  );
};

const GRID_GAP = 12;
const CELL_WIDTH = (SCREEN_WIDTH - spacing.xl * 2 - GRID_GAP * 2) / 3;

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  topTextBox: { flex: 1, marginLeft: 16 },
  topKicker: { color: colors.mustard, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  topTitle: { color: colors.text, fontSize: fontSizes.lg, fontWeight: '900', marginTop: 4 },
  topSub: { color: colors.textMuted, fontSize: fontSizes.sm, marginTop: 6, lineHeight: fontSizes.sm * 1.4 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    justifyContent: 'space-between',
  },
  statCell: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  statDot: { width: 6, height: 6, borderRadius: 3, marginBottom: 4 },
  statLabel: { color: colors.textDim, fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  statValue: { color: colors.text, fontSize: fontSizes.sm, fontWeight: '900', marginTop: 2 },
  statTotal: { color: colors.textDim, fontSize: 10, fontWeight: '600' },
  filterBar: { paddingHorizontal: spacing.xl, marginBottom: 8 },
  modeSwitch: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 3,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginBottom: 10,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: IS_SMALL_SCREEN ? 6 : 8,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  modeBtnActive: { backgroundColor: colors.mustard },
  modeText: { color: colors.textMuted, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1 },
  modeTextActive: { color: colors.textInk },
  districtRow: { flexDirection: 'row', justifyContent: 'space-between' },
  districtChip: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: IS_SMALL_SCREEN ? 6 : 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  districtChipText: { color: colors.textMuted, fontSize: 16, fontWeight: '900' },
  grid: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  gridRow: { marginBottom: 16 },
  stampCell: {
    width: CELL_WIDTH,
    marginRight: GRID_GAP,
    alignItems: 'center',
  },
  stampTitle: {
    color: colors.textDim,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },
  seenDot: {
    position: 'absolute',
    top: -2,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  seenDotText: { color: colors.textMuted, fontSize: 8, fontWeight: '700' },
  empty: { alignItems: 'center', padding: 24, margin: spacing.xl },
  emptyIcon: { color: colors.textDim, fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: colors.text, fontSize: fontSizes.md, fontWeight: '800', marginBottom: 4 },
  emptyText: { color: colors.textMuted, fontSize: fontSizes.sm, textAlign: 'center' },
});

export default CollectionScreen;