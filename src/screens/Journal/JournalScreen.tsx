import React, { useMemo, useState } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenFrame from '../../components/ScreenFrame';
import HeaderBar from '../../components/HeaderBar';
import JournalEntry from '../../components/JournalEntry';
import { journalData } from '../../data/blog';
import { JournalPost, RootStackParamList } from '../../types';
import { colors, fontSizes, IS_SMALL_SCREEN, radius, spacing } from '../../theme/theme';
import { useFadeIn } from '../../hooks/useFadeIn';

const JournalScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTag, setActiveTag] = useState<string>('all');

  const allTags = useMemo(() => {
    const set = new Set<string>();
    journalData.forEach(p => set.add(p.tag));
    return ['all', ...Array.from(set)];
  }, []);

  const filtered = useMemo<JournalPost[]>(() => {
    if (activeTag === 'all') return journalData;
    return journalData.filter(p => p.tag === activeTag);
  }, [activeTag]);

  const headerAnim = useFadeIn(80, 420);
  const tagsAnim = useFadeIn(180, 420);
  const metaAnim = useFadeIn(260, 420);

  const open = (post: JournalPost) => navigation.navigate('JournalEntry', { postId: post.id });

  return (
    <ScreenFrame withTabBarSpace>
      <HeaderBar
        kicker="TRAVEL STORIES"
        title="Journal"
        right={
          <View style={styles.countPill}>
            <Text style={styles.countText}>{journalData.length}</Text>
          </View>
        }
      />

      <Animated.View
        style={[
          styles.intro,
          { opacity: headerAnim.opacity, transform: [{ translateY: headerAnim.translateY }] },
        ]}
      >
        <View style={styles.introLine} />
        <Text style={styles.introText}>
          Field notes from Alex, your local guide through the streets, peaks and secrets of Boulder.
        </Text>
        <View style={styles.introLine} />
      </Animated.View>

      <Animated.View
        style={[
          styles.tagsWrap,
          { opacity: tagsAnim.opacity, transform: [{ translateY: tagsAnim.translateY }] },
        ]}
      >
        <FlatList
          data={allTags}
          keyExtractor={i => i}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsList}
          renderItem={({ item }) => {
            const isActive = activeTag === item;
            const label = item === 'all' ? 'ALL STORIES' : item.toUpperCase();
            return (
              <Pressable
                onPress={() => setActiveTag(item)}
                style={[styles.tagChip, isActive && styles.tagChipActive]}
              >
                <Text style={[styles.tagChipText, isActive && styles.tagChipTextActive]}>
                  {label}
                </Text>
              </Pressable>
            );
          }}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.metaRow,
          { opacity: metaAnim.opacity, transform: [{ translateY: metaAnim.translateY }] },
        ]}
      >
        <Text style={styles.metaText}>
          <Text style={styles.metaNum}>{filtered.length}</Text> entries
        </Text>
        <View style={styles.metaDivider} />
        <Text style={styles.metaSub}>by Alex · your guide</Text>
      </Animated.View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item, index }) => (
          <JournalEntry post={item} index={index} onPress={() => open(item)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✎</Text>
            <Text style={styles.emptyTitle}>No stories under this tag</Text>
            <Text style={styles.emptyText}>Try a different category above</Text>
          </View>
        }
      />
    </ScreenFrame>
  );
};

const styles = StyleSheet.create({
  countPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.mustard,
    backgroundColor: colors.chipBgMustard,
  },
  countText: { color: colors.mustard, fontSize: fontSizes.sm, fontWeight: '900' },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: IS_SMALL_SCREEN ? spacing.sm : spacing.md,
  },
  introLine: { width: 18, height: 1, backgroundColor: colors.terracotta },
  introText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    marginHorizontal: 10,
    lineHeight: fontSizes.sm * 1.4,
  },
  tagsWrap: { marginBottom: spacing.sm },
  tagsList: { paddingHorizontal: spacing.xl, paddingVertical: 4 },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    marginRight: 8,
  },
  tagChipActive: { borderColor: colors.mustard, backgroundColor: colors.chipBgMustard },
  tagChipText: { color: colors.textMuted, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1 },
  tagChipTextActive: { color: colors.mustard },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  metaText: { color: colors.text, fontSize: fontSizes.sm, fontWeight: '700' },
  metaNum: { color: colors.terracotta, fontWeight: '900' },
  metaDivider: { flex: 1, height: 1, backgroundColor: colors.borderSoft, marginHorizontal: 10 },
  metaSub: { color: colors.textDim, fontSize: fontSizes.xs, fontStyle: 'italic' },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { color: colors.textDim, fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: colors.text, fontSize: fontSizes.lg, fontWeight: '800', marginBottom: 4 },
  emptyText: { color: colors.textMuted, fontSize: fontSizes.sm },
});

export default JournalScreen;