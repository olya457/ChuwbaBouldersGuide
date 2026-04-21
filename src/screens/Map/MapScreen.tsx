import React, { useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import ScreenFrame from '../../components/ScreenFrame';
import HeaderBar from '../../components/HeaderBar';
import { artifactsData } from '../../data/locations';
import {
  colors,
  districtColors,
  fontSizes,
  IS_ANDROID,
  IS_SMALL_SCREEN,
  radius,
  SCREEN_WIDTH,
  spacing,
} from '../../theme/theme';
import { Artifact, RootStackParamList } from '../../types';
import { useCollection } from '../../storage/CollectionContext';
import { useFadeIn, useFadeInScale } from '../../hooks/useFadeIn';

const CENTER_COORD = { latitude: 39.9956, longitude: -105.2797 };

const MapScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mapRef = useRef<MapView>(null);
  const { isCollected } = useCollection();
  const [selected, setSelected] = useState<Artifact | null>(null);
  const [zoom, setZoom] = useState({ latitudeDelta: 0.08, longitudeDelta: 0.08 });
  const [filterDist, setFilterDist] = useState<string>('all');

  const visibleData = artifactsData.filter(
    a => filterDist === 'all' || a.district === filterDist,
  );

  const zoomBy = (factor: number) => {
    const next = {
      latitudeDelta: zoom.latitudeDelta * factor,
      longitudeDelta: zoom.longitudeDelta * factor,
    };
    setZoom(next);
    mapRef.current?.animateToRegion({ ...CENTER_COORD, ...next }, 250);
  };

  const reset = () => {
    const next = { latitudeDelta: 0.08, longitudeDelta: 0.08 };
    setZoom(next);
    mapRef.current?.animateToRegion({ ...CENTER_COORD, ...next }, 350);
  };

  const handleMarkerPress = (loc: Artifact) => {
    setSelected(loc);
    mapRef.current?.animateToRegion(
      {
        latitude: loc.latitude,
        longitude: loc.longitude,
        latitudeDelta: zoom.latitudeDelta,
        longitudeDelta: zoom.longitudeDelta,
      },
      300,
    );
  };

  const openDetails = () => {
    if (!selected) return;
    navigation.navigate('ArtifactDetail', { artifactId: selected.id });
    setSelected(null);
  };

  const legendAnim = useFadeIn(80, 420);
  const mapAnim = useFadeIn(180, 420);
  const popupAnim = useFadeInScale(0, 300);

  return (
<ScreenFrame withTabBarSpace>
      <HeaderBar
        kicker="INTERACTIVE"
        title="Map"
        right={
          <View style={styles.spotsPill}>
            <Text style={styles.spotsText}>{visibleData.length}</Text>
          </View>
        }
      />

      <Animated.View
        style={[
          styles.legend,
          { opacity: legendAnim.opacity, transform: [{ translateY: legendAnim.translateY }] },
        ]}
      >
        <Pressable
          style={[styles.legendItem, filterDist === 'all' && styles.legendItemActive]}
          onPress={() => setFilterDist('all')}
        >
          <View style={[styles.legendDot, { backgroundColor: colors.mustard }]} />
          <Text style={[styles.legendText, filterDist === 'all' && { color: colors.mustard }]}>
            ALL
          </Text>
        </Pressable>
        {Object.entries(districtColors).map(([k, v]) => {
          const isActive = filterDist === k;
          return (
            <Pressable
              key={k}
              style={[styles.legendItem, isActive && { borderColor: v, backgroundColor: `${v}22` }]}
              onPress={() => setFilterDist(k)}
            >
              <View style={[styles.legendDot, { backgroundColor: v }]} />
              <Text style={[styles.legendText, isActive && { color: v }]}>
                {k.slice(0, 3).toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>

      <Animated.View
        style={[
          styles.mapWrap,
          { opacity: mapAnim.opacity, transform: [{ translateY: mapAnim.translateY }] },
        ]}
      >
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={IS_ANDROID ? PROVIDER_GOOGLE : undefined}
          initialRegion={{ ...CENTER_COORD, ...zoom }}
          onPress={() => setSelected(null)}
        >
          {visibleData.map(loc => {
            const collected = isCollected(loc.id);
            return (
              <Marker
                key={loc.id}
                identifier={loc.id}
                coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                pinColor={collected ? colors.mustard : districtColors[loc.district]}
                onPress={e => {
                  e.stopPropagation();
                  handleMarkerPress(loc);
                }}
                tracksViewChanges={false}
              />
            );
          })}
        </MapView>

        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          <View style={styles.controls}>
            <Pressable style={styles.ctrlBtn} onPress={() => zoomBy(0.5)}>
              <Text style={styles.ctrlIcon}>+</Text>
            </Pressable>
            <Pressable style={styles.ctrlBtn} onPress={() => zoomBy(2)}>
              <Text style={styles.ctrlIcon}>−</Text>
            </Pressable>
            <Pressable style={styles.ctrlBtn} onPress={reset}>
              <Text style={styles.ctrlIcon}>◎</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>

      {selected ? (
        <Pressable style={styles.backdrop} onPress={() => setSelected(null)}>
          <Animated.View
            style={[
              styles.popup,
              { opacity: popupAnim.opacity, transform: [{ scale: popupAnim.scale }] },
            ]}
          >
            <Pressable onPress={() => {}}>
              <Image source={selected.image} style={styles.popupImage} resizeMode="cover" />
              <LinearGradient
                colors={['transparent', 'rgba(11,18,32,0.85)']}
                style={styles.popupGradient}
              />
              <Pressable
                style={styles.popupClose}
                onPress={() => setSelected(null)}
                hitSlop={10}
              >
                <Text style={styles.popupCloseText}>✕</Text>
              </Pressable>
              <View style={styles.popupBody}>
                <View style={styles.popupTopRow}>
                  <View
                    style={[
                      styles.popupTag,
                      { borderColor: districtColors[selected.district] },
                    ]}
                  >
                    <Text
                      style={[
                        styles.popupTagText,
                        { color: districtColors[selected.district] },
                      ]}
                    >
                      {selected.district.toUpperCase()}
                    </Text>
                  </View>
                  {isCollected(selected.id) ? (
                    <View style={styles.popupCollected}>
                      <Text style={styles.popupCollectedText}>◉ COLLECTED</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.popupTitle} numberOfLines={2}>{selected.title}</Text>
                <Text style={styles.popupSub} numberOfLines={2}>{selected.subtitle}</Text>
                <Text style={styles.popupCoords}>◇ {selected.gpsText}</Text>
                <Pressable onPress={openDetails} style={styles.popupBtn}>
                  <LinearGradient
                    colors={[colors.terracotta, colors.mustard]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.popupBtnGradient}
                  >
                    <Text style={styles.popupBtnText}>EXPLORE →</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      ) : null}
    </ScreenFrame>
  );
};

const POPUP_WIDTH = Math.min(SCREEN_WIDTH - 32, 360);
const POPUP_IMAGE_HEIGHT = IS_SMALL_SCREEN ? 120 : 150;

const styles = StyleSheet.create({
  spotsPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.terracotta,
    backgroundColor: colors.chipBg,
  },
  spotsText: { color: colors.terracotta, fontSize: fontSizes.sm, fontWeight: '900' },
  legend: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    justifyContent: 'space-between',
  },
  legendItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginHorizontal: 2,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  legendItemActive: { borderColor: colors.mustard, backgroundColor: colors.chipBgMustard },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  legendText: { color: colors.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  mapWrap: {
    flex: 1,
    margin: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  map: { ...StyleSheet.absoluteFillObject },
  controls: { position: 'absolute', top: 12, right: 12 },
  ctrlBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(15,24,41,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  ctrlIcon: { color: colors.mustard, fontSize: 18, fontWeight: '900' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,18,32,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    zIndex: 100,
  },
  popup: {
    width: POPUP_WIDTH,
    backgroundColor: colors.bgAlt,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  popupImage: { width: '100%', height: POPUP_IMAGE_HEIGHT },
  popupGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: POPUP_IMAGE_HEIGHT - 40,
    height: 40,
  },
  popupClose: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(11,18,32,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  popupCloseText: { color: colors.text, fontSize: 14, fontWeight: '800' },
  popupBody: { padding: IS_SMALL_SCREEN ? 14 : 18 },
  popupTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  popupTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  popupTagText: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  popupCollected: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.chipBgMustard,
    borderWidth: 1,
    borderColor: colors.mustard,
  },
  popupCollectedText: { color: colors.mustard, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  popupTitle: { color: colors.text, fontSize: fontSizes.lg, fontWeight: '900' },
  popupSub: { color: colors.textMuted, fontSize: fontSizes.sm, marginTop: 4, lineHeight: fontSizes.sm * 1.4 },
  popupCoords: { color: colors.textDim, fontSize: fontSizes.xs, marginTop: 8 },
  popupBtn: { marginTop: 14, borderRadius: radius.pill, overflow: 'hidden', height: IS_SMALL_SCREEN ? 44 : 50 },
  popupBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupBtnText: {
    color: colors.textInk,
    fontSize: fontSizes.sm,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});

export default MapScreen;