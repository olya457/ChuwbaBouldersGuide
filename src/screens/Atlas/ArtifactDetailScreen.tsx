import React, { useEffect, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import ScreenFrame from '../../components/ScreenFrame';
import GlassPanel from '../../components/GlassPanel';
import { artifactsData } from '../../data/locations';
import { Artifact, RootStackParamList } from '../../types';
import {
  colors,
  districtColors,
  fontSizes,
  IS_ANDROID,
  IS_SMALL_SCREEN,
  radius,
  rarityColors,
  spacing,
} from '../../theme/theme';
import { useCollection } from '../../storage/CollectionContext';
import { useFadeIn, useFadeInScale } from '../../hooks/useFadeIn';
import { useAppInsets } from '../../hooks/useInsets';

type Props = NativeStackScreenProps<RootStackParamList, 'ArtifactDetail'>;

const ArtifactDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useAppInsets();
  const artifact = artifactsData.find((a: Artifact) => a.id === route.params.artifactId);
  const { isCollected, isVisited, toggleCollect, markVisited } = useCollection();
  const [mapOpen, setMapOpen] = useState(false);

  const headerAnim = useFadeIn(0, 400);
  const metaAnim = useFadeIn(120, 420);
  const descAnim = useFadeIn(220, 420);
  const actionsAnim = useFadeInScale(320, 420);

  useEffect(() => {
    if (artifact) markVisited(artifact.id);
  }, [artifact, markVisited]);

  if (!artifact) {
    return (
      <ScreenFrame>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Artifact not found</Text>
        </View>
      </ScreenFrame>
    );
  }

  const collected = isCollected(artifact.id);
  const visited = isVisited(artifact.id);
  const accent = districtColors[artifact.district] ?? colors.terracotta;
  const rarityColor = rarityColors[artifact.rarity];

  const onShare = () => {
    Share.share({ message: `${artifact.title} — ${artifact.address}` });
  };

  return (
    <ScreenFrame contentPaddingTop={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
      >
        <Animated.View
          style={[
            styles.cover,
            { opacity: headerAnim.opacity, transform: [{ translateY: headerAnim.translateY }] },
          ]}
        >
          <Image source={artifact.image} style={styles.coverImg} />
          <LinearGradient
            colors={['rgba(11,18,32,0.6)', 'transparent', 'rgba(11,18,32,0.95)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.coverTop, { paddingTop: insets.top + 8 }]}>
            <Pressable onPress={() => navigation.goBack()} style={styles.roundBtn}>
              <Text style={styles.roundIcon}>←</Text>
            </Pressable>
            <View style={styles.topRight}>
              <View style={[styles.rarityPill, { borderColor: rarityColor, backgroundColor: `${rarityColor}33` }]}>
                <Text style={[styles.rarityText, { color: rarityColor }]}>
                  ◆ {artifact.rarity.toUpperCase()}
                </Text>
              </View>
              <Pressable onPress={() => toggleCollect(artifact.id)} style={styles.roundBtn}>
                <Text style={[styles.roundIcon, collected && { color: accent }]}>
                  {collected ? '◉' : '○'}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.coverBottom}>
            <View style={styles.districtRow}>
              <View style={[styles.dot, { backgroundColor: accent }]} />
              <Text style={[styles.districtText, { color: accent }]}>
                {artifact.district.toUpperCase()} DISTRICT
              </Text>
              {visited ? (
                <View style={styles.visitedBadge}>
                  <Text style={styles.visitedText}>◈ DISCOVERED</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.title}>{artifact.title}</Text>
            <Text style={styles.subtitle}>{artifact.subtitle}</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.body,
            { opacity: metaAnim.opacity, transform: [{ translateY: metaAnim.translateY }] },
          ]}
        >
          <GlassPanel variant="accent" style={styles.gpsCard}>
            <View style={styles.gpsRow}>
              <View style={[styles.gpsIcon, { backgroundColor: accent }]}>
                <Text style={styles.gpsIconText}>◈</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.gpsLabel}>COORDINATES</Text>
                <Text style={[styles.gpsText, { color: accent }]}>{artifact.gpsText}</Text>
                <Text style={styles.gpsDecimal}>{artifact.gpsDecimal}</Text>
              </View>
            </View>
            <View style={styles.gpsDivider} />
            <Text style={styles.addressLabel}>ADDRESS</Text>
            <Text style={styles.addressText}>{artifact.address}</Text>
          </GlassPanel>
        </Animated.View>

        <Animated.View
          style={[
            styles.body,
            { opacity: descAnim.opacity, transform: [{ translateY: descAnim.translateY }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>About this place</Text>
          </View>
          <Text style={styles.description}>{artifact.description}</Text>

          {mapOpen ? (
            <View style={styles.mapBlock}>
              <View style={styles.mapHeader}>
                <Text style={styles.mapTitle}>Location on map</Text>
                <Pressable onPress={() => setMapOpen(false)} style={styles.closeMapBtn}>
                  <Text style={styles.closeMapText}>✕ Close</Text>
                </Pressable>
              </View>
              <View style={styles.mapWrap}>
                <MapView
                  style={styles.map}
                  provider={IS_ANDROID ? PROVIDER_GOOGLE : undefined}
                  initialRegion={{
                    latitude: artifact.latitude,
                    longitude: artifact.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}
                >
                  <Marker
                    coordinate={{ latitude: artifact.latitude, longitude: artifact.longitude }}
                    title={artifact.title}
                    description={artifact.subtitle}
                    pinColor={accent}
                  />
                </MapView>
              </View>
            </View>
          ) : null}
        </Animated.View>

        <Animated.View
          style={[
            styles.body,
            styles.actionsWrap,
            { opacity: actionsAnim.opacity, transform: [{ scale: actionsAnim.scale }] },
          ]}
        >
          <Pressable
            onPress={() => setMapOpen(v => !v)}
            style={[styles.actionBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.mustard }]}
          >
            <Text style={[styles.actionIcon, { color: colors.mustard }]}>◇</Text>
            <Text style={styles.actionLabel}>{mapOpen ? 'HIDE' : 'MAP'}</Text>
          </Pressable>
          <Pressable
            onPress={() => toggleCollect(artifact.id)}
            style={[
              styles.actionBtn,
              collected
                ? { backgroundColor: `${accent}33`, borderColor: accent }
                : { backgroundColor: colors.surface, borderColor: colors.borderSoft },
            ]}
          >
            <Text style={[styles.actionIcon, { color: collected ? accent : colors.textMuted }]}>
              {collected ? '◉' : '○'}
            </Text>
            <Text style={styles.actionLabel}>{collected ? 'COLLECTED' : 'COLLECT'}</Text>
          </Pressable>
          <Pressable
            onPress={onShare}
            style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.borderSoft }]}
          >
            <Text style={[styles.actionIcon, { color: colors.terracotta }]}>↗</Text>
            <Text style={styles.actionLabel}>SHARE</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </ScreenFrame>
  );
};

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: colors.textMuted, fontSize: fontSizes.lg },
  cover: {
    height: IS_SMALL_SCREEN ? 320 : 380,
    position: 'relative',
  },
  coverImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  coverTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 10,
  },
  topRight: { flexDirection: 'row', alignItems: 'center' },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(11,18,32,0.65)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundIcon: { color: colors.text, fontSize: 18, fontWeight: '900' },
  rarityPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    marginRight: 8,
  },
  rarityText: { fontSize: fontSizes.xs, fontWeight: '900', letterSpacing: 1.2 },
  coverBottom: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    bottom: spacing.lg,
  },
  districtRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  districtText: { fontSize: fontSizes.xs, fontWeight: '900', letterSpacing: 1.5 },
  visitedBadge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: `${colors.sage}33`,
    borderWidth: 1,
    borderColor: colors.sage,
  },
  visitedText: { color: colors.sage, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  title: {
    color: colors.text,
    fontSize: IS_SMALL_SCREEN ? fontSizes.xl : fontSizes.xxl - 4,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  subtitle: { color: colors.textMuted, fontSize: fontSizes.sm, marginTop: 4 },
  body: { paddingHorizontal: spacing.xl, marginTop: spacing.lg },
  gpsCard: { padding: 14 },
  gpsRow: { flexDirection: 'row', alignItems: 'center' },
  gpsIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gpsIconText: { color: colors.textInk, fontSize: 20, fontWeight: '900' },
  gpsLabel: { color: colors.mustard, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  gpsText: { fontSize: fontSizes.md, fontWeight: '800', marginTop: 2 },
  gpsDecimal: { color: colors.textDim, fontSize: fontSizes.xs, marginTop: 1 },
  gpsDivider: { height: 1, backgroundColor: colors.borderSoft, marginVertical: 12 },
  addressLabel: { color: colors.mustard, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  addressText: { color: colors.text, fontSize: fontSizes.sm, marginTop: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionBar: { width: 3, height: 16, backgroundColor: colors.terracotta, borderRadius: 2, marginRight: 8 },
  sectionTitle: { color: colors.text, fontSize: fontSizes.lg, fontWeight: '900' },
  description: { color: colors.textMuted, fontSize: fontSizes.md, lineHeight: fontSizes.md * 1.55 },
  mapBlock: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: 12,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mapTitle: { color: colors.text, fontSize: fontSizes.sm, fontWeight: '800' },
  closeMapBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.mustard,
  },
  closeMapText: { color: colors.mustard, fontSize: 10, fontWeight: '800' },
  mapWrap: { height: 200, borderRadius: radius.md, overflow: 'hidden' },
  map: { flex: 1 },
  actionsWrap: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1.5,
    marginHorizontal: 4,
  },
  actionIcon: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
  actionLabel: { color: colors.text, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
});

export default ArtifactDetailScreen;