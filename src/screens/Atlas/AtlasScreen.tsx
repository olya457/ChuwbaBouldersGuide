import React, { useMemo, useState } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenFrame from '../../components/ScreenFrame';
import HeaderBar from '../../components/HeaderBar';
import RadialDial from '../../components/RadialDial';
import ArtifactCard from '../../components/ArtifactCard';
import { districts } from '../../data/districts';
import { artifactsData } from '../../data/locations';
import { Artifact, District, RootStackParamList } from '../../types';
import { colors, fontSizes, IS_SMALL_SCREEN, radius, spacing } from '../../theme/theme';
import { useCollection } from '../../storage/CollectionContext';
import { useFadeIn } from '../../hooks/useFadeIn';

const AtlasScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeDist, setActiveDist] = useState<District['id']>('all');
  const [query, setQuery] = useState('');
  const { collected } = useCollection();

  const filtered = useMemo<Artifact[]>(() => {
    return artifactsData.filter(a => {
      const byDist = activeDist === 'all' || a.district === activeDist;
      const byQuery = !query.trim() || a.title.toLowerCase().includes(query.toLowerCase());
      return byDist && byQuery;
    });
  }, [activeDist, query]);

  const statsAnim = useFadeIn(100, 480);
  const searchAnim = useFadeIn(180, 480);
  const dialAnim = useFadeIn(260, 520);
  const listAnim = useFadeIn(340, 480);

  return (
   <ScreenFrame withTabBarSpace>
      <HeaderBar
        kicker="BOULDER, COLORADO"
        title="Atlas"
        right={
          <View style={styles.counterBadge}>
            <Text style={styles.counterNum}>{collected.length}</Text>
            <Text style={styles.counterTotal}>/{artifactsData.length}</Text>
          </View>
        }
      />

      <Animated.View
        style={[
          styles.searchWrap,
          { opacity: searchAnim.opacity, transform: [{ translateY: searchAnim.translateY }] },
        ]}
      >
        <Text style={styles.searchIcon}>◎</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search artifacts..."
          placeholderTextColor={colors.textDim}
          style={styles.searchInput}
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery('')} hitSlop={10}>
            <Text style={styles.clearIcon}>✕</Text>
          </Pressable>
        ) : null}
      </Animated.View>

      <Animated.View
        style={[
          styles.dialWrap,
          { opacity: dialAnim.opacity, transform: [{ translateY: dialAnim.translateY }] },
        ]}
      >
        <RadialDial
          districts={districts}
          active={activeDist}
          onChange={setActiveDist}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.countLine,
          { opacity: statsAnim.opacity, transform: [{ translateY: statsAnim.translateY }] },
        ]}
      >
        <View style={styles.countLeft}>
          <Text style={styles.countNum}>{filtered.length}</Text>
          <Text style={styles.countLabel}>artifacts found</Text>
        </View>
        <View style={styles.legendLine} />
        <Text style={styles.countHint}>scroll to explore</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.listWrap,
          { opacity: listAnim.opacity, transform: [{ translateY: listAnim.translateY }] },
        ]}
      >
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          renderItem={({ item, index }) => (
            <ArtifactCard
              artifact={item}
              index={index}
              layout="row"
              onPress={() => navigation.navigate('ArtifactDetail', { artifactId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>◯</Text>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptyText}>Try another district or clear the search</Text>
            </View>
          }
        />
      </Animated.View>
    </ScreenFrame>
  );
};

const styles = StyleSheet.create({
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.mustard,
    backgroundColor: colors.chipBgMustard,
  },
  counterNum: { color: colors.mustard, fontSize: fontSizes.sm, fontWeight: '900' },
  counterTotal: { color: colors.textMuted, fontSize: fontSizes.xs, fontWeight: '700' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 14,
    marginBottom: IS_SMALL_SCREEN ? spacing.sm : spacing.md,
  },
  searchIcon: { color: colors.mustard, fontSize: 14, marginRight: 8, fontWeight: '900' },
  searchInput: { flex: 1, color: colors.text, fontSize: fontSizes.md, paddingVertical: IS_SMALL_SCREEN ? 8 : 10 },
  clearIcon: { color: colors.textDim, fontSize: 14, fontWeight: '800' },
  dialWrap: {
    alignItems: 'center',
    marginVertical: IS_SMALL_SCREEN ? 4 : 10,
  },
  countLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginVertical: IS_SMALL_SCREEN ? 6 : 12,
  },
  countLeft: { flexDirection: 'row', alignItems: 'baseline' },
  countNum: { color: colors.terracotta, fontSize: fontSizes.lg, fontWeight: '900' },
  countLabel: { color: colors.textMuted, fontSize: fontSizes.sm, marginLeft: 6, fontWeight: '600' },
  legendLine: { flex: 1, height: 1, backgroundColor: colors.borderSoft, marginHorizontal: 12 },
  countHint: { color: colors.textDim, fontSize: fontSizes.xs, fontWeight: '600', letterSpacing: 0.5 },
  listWrap: { flex: 1 },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { color: colors.textDim, fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: colors.text, fontSize: fontSizes.lg, fontWeight: '800', marginBottom: 4 },
  emptyText: { color: colors.textMuted, fontSize: fontSizes.sm },
});

export default AtlasScreen;