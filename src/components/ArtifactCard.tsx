import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Artifact } from '../types';
import { colors, districtColors, fontSizes, IS_SMALL_SCREEN, radius, rarityColors } from '../theme/theme';
import { useCollection } from '../storage/CollectionContext';
import { useFadeIn } from '../hooks/useFadeIn';

interface Props {
  artifact: Artifact;
  onPress: () => void;
  index?: number;
  layout?: 'feature' | 'row';
}

const ArtifactCard: React.FC<Props> = ({ artifact, onPress, index = 0, layout = 'row' }) => {
  const { isCollected, isVisited, toggleCollect } = useCollection();
  const collected = isCollected(artifact.id);
  const visited = isVisited(artifact.id);
  const { opacity, translateY } = useFadeIn(index * 60, 420);

  const accent = districtColors[artifact.district] ?? colors.terracotta;
  const rarityColor = rarityColors[artifact.rarity];
  const rarityLabel = artifact.rarity.toUpperCase();

  if (layout === 'feature') {
    return (
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <Pressable style={styles.feature} onPress={onPress}>
          <Image source={artifact.image} style={styles.featureImg} />
          <LinearGradient
            colors={['transparent', 'rgba(11,18,32,0.3)', 'rgba(11,18,32,0.92)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.featureTop}>
            <View style={[styles.rarityPill, { borderColor: rarityColor, backgroundColor: `${rarityColor}22` }]}>
              <Text style={[styles.rarityText, { color: rarityColor }]}>◆ {rarityLabel}</Text>
            </View>
            <Pressable
              onPress={() => toggleCollect(artifact.id)}
              hitSlop={10}
              style={[styles.markBtn, collected && { borderColor: accent, backgroundColor: `${accent}33` }]}
            >
              <Text style={[styles.markText, { color: collected ? accent : colors.textMuted }]}>
                {collected ? '◉' : '○'}
              </Text>
            </Pressable>
          </View>
          <View style={styles.featureBottom}>
            <View style={styles.districtRow}>
              <View style={[styles.dot, { backgroundColor: accent }]} />
              <Text style={[styles.districtText, { color: accent }]}>
                {artifact.district.toUpperCase()}
              </Text>
              {visited ? (
                <View style={styles.visitedBadge}>
                  <Text style={styles.visitedText}>◈ VISITED</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.featureTitle} numberOfLines={2}>{artifact.title}</Text>
            <Text style={styles.featureSub} numberOfLines={2}>{artifact.subtitle}</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable style={styles.row} onPress={onPress}>
        <View style={styles.rowImgWrap}>
          <Image source={artifact.image} style={styles.rowImg} />
          <View style={[styles.rowRarityDot, { backgroundColor: rarityColor }]} />
        </View>
        <View style={styles.rowBody}>
          <View style={styles.rowTopLine}>
            <View style={[styles.districtTag, { borderColor: accent }]}>
              <Text style={[styles.districtTagText, { color: accent }]}>
                {artifact.district.toUpperCase()}
              </Text>
            </View>
            {collected ? (
              <Text style={[styles.collectedMark, { color: accent }]}>◉</Text>
            ) : null}
          </View>
          <Text style={styles.rowTitle} numberOfLines={1}>{artifact.title}</Text>
          <Text style={styles.rowSub} numberOfLines={2}>{artifact.subtitle}</Text>
          <Text style={styles.rowCoords} numberOfLines={1}>◇ {artifact.gpsText}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  feature: {
    height: IS_SMALL_SCREEN ? 200 : 240,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.bgAlt,
    marginBottom: 12,
  },
  featureImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  featureTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  featureBottom: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
  },
  rarityPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  rarityText: { fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1 },
  markBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: 'rgba(11,18,32,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: { fontSize: 18, fontWeight: '800' },
  districtRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  districtText: { fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1.5 },
  visitedBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: `${colors.sage}33`,
    borderWidth: 1,
    borderColor: colors.sage,
  },
  visitedText: { color: colors.sage, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  featureTitle: {
    color: colors.text,
    fontSize: IS_SMALL_SCREEN ? fontSizes.lg : fontSizes.xl,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  featureSub: { color: colors.textMuted, fontSize: fontSizes.sm, marginTop: 4 },
  row: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 10,
    marginBottom: 10,
  },
  rowImgWrap: {
    width: IS_SMALL_SCREEN ? 72 : 82,
    height: IS_SMALL_SCREEN ? 72 : 82,
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
  },
  rowImg: { width: '100%', height: '100%' },
  rowRarityDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.bg,
  },
  rowBody: { flex: 1, justifyContent: 'center' },
  rowTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  districtTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.xs,
    borderWidth: 1,
  },
  districtTagText: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  collectedMark: { fontSize: 16, fontWeight: '900' },
  rowTitle: { color: colors.text, fontSize: fontSizes.md, fontWeight: '800', marginBottom: 2 },
  rowSub: { color: colors.textMuted, fontSize: fontSizes.sm, lineHeight: fontSizes.sm * 1.35 },
  rowCoords: { color: colors.textDim, fontSize: 10, marginTop: 4, letterSpacing: 0.3 },
});

export default ArtifactCard;